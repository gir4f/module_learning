<template>
  <div class="app">
    <AppHeader />

    <main class="product-page">
      <section class="product-panel">
        <div class="panel-heading">
          <div>
            <p>Produk</p>
            <h1>{{ editingId ? 'Edit Produk' : 'Tambah Produk' }}</h1>
          </div>
          <button type="button" class="secondary-action" @click="resetForm">Baru</button>
        </div>

        <form class="product-form" @submit.prevent="saveProduct">
          <div class="mode-options">
            <label>
              <input v-model="form.moduleMode" type="radio" value="existing" />
              Pilih modul yang sudah ada
            </label>
            <label>
              <input v-model="form.moduleMode" type="radio" value="new" />
              Buat modul produk baru
            </label>
          </div>

          <label>
            Modul Produk
            <select v-if="form.moduleMode === 'existing'" v-model="form.parentSlug" required>
              <option value="" disabled>Pilih modul</option>
              <option v-for="module in productModules" :key="module.slug" :value="module.slug">
                {{ module.name }}
              </option>
            </select>
            <input
              v-else
              v-model.trim="form.newModuleName"
              type="text"
              placeholder="Contoh: Locotrack"
              required
            />
          </label>

          <label>
            Nama Detail Produk
            <input v-model.trim="form.name" type="text" placeholder="Contoh: Kabel Body Limiter Hino GB150" required />
          </label>

          <label>
            Kata Kunci
            <input v-model.trim="form.keywords" type="text" placeholder="kata kunci pencarian produk" />
          </label>

          <label>
            Kelengkapan Barang
            <textarea
              v-model="form.itemsText"
              rows="5"
              placeholder="Satu kelengkapan per baris"
            ></textarea>
          </label>

          <p v-if="error" class="form-error">{{ error }}</p>

          <div class="form-actions">
            <button type="submit">{{ editingId ? 'Simpan Perubahan' : 'Tambah Produk' }}</button>
            <button v-if="editingId" type="button" class="ghost-action" @click="resetForm">Batal</button>
          </div>
        </form>
      </section>

      <section class="product-panel list-panel">
        <div class="panel-heading">
          <div>
            <p>Data</p>
            <h1>Daftar Produk</h1>
          </div>
          <span>{{ products.length }} produk</span>
        </div>

        <div v-if="!products.length" class="empty-state">
          Belum ada produk tambahan.
        </div>

        <div v-else class="product-list">
          <article v-for="product in products" :key="product.id" class="product-card">
            <div>
              <h2>{{ product.name }}</h2>
              <p>{{ getModuleName(product.parentSlug) }} - {{ product.keywords || 'Tanpa kata kunci tambahan' }}</p>
              <ul v-if="product.items.length">
                <li v-for="item in product.items" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="card-actions">
              <button type="button" @click="openProduct(product)">Lihat</button>
              <button type="button" @click="editProduct(product)">Edit</button>
              <button type="button" class="danger-action" @click="deleteProduct(product.id)">Hapus</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import { modules as staticModules } from '@/data/modules'
import {
  isDuplicateModuleSlug,
  isDuplicateProductName,
  getInferredModulesFromProducts,
  loadCustomModules,
  loadProducts,
  makeSlug,
  saveCustomModules,
  saveProducts,
} from '@/data/products'

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      products: [],
      editingId: null,
      error: '',
      customModules: [],
      form: {
        moduleMode: 'existing',
        parentSlug: '',
        newModuleName: '',
        name: '',
        keywords: '',
        itemsText: '',
      },
    }
  },
  mounted() {
    this.products = loadProducts()
    this.customModules = loadCustomModules()
  },
  computed: {
    modules() {
      return [...staticModules, ...this.customModules, ...getInferredModulesFromProducts(this.products)]
    },
    productModules() {
      return this.modules.filter((module) => module.slug !== 'alur-kerja')
    },
  },
  methods: {
    resetForm() {
      this.editingId = null
      this.error = ''
      this.form = {
        moduleMode: 'existing',
        parentSlug: '',
        newModuleName: '',
        name: '',
        keywords: '',
        itemsText: '',
      }
    },
    resolveParentSlug() {
      if (this.form.moduleMode === 'existing') return this.form.parentSlug

      return makeSlug(this.form.newModuleName)
    },
    buildProduct() {
      const detailSlug = makeSlug(this.form.name)
      const items = this.form.itemsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      return {
        id: this.editingId || `${Date.now()}`,
        parentSlug: this.resolveParentSlug(),
        detailSlug,
        slug: this.resolveParentSlug(),
        name: this.form.name,
        keywords: this.form.keywords,
        items,
      }
    },
    saveProduct() {
      this.error = ''
      const product = this.buildProduct()

      if (this.form.moduleMode === 'new') {
        const moduleSlug = makeSlug(this.form.newModuleName)

        if (!moduleSlug) {
          this.error = 'Nama modul produk baru belum valid.'
          return
        }

        if (isDuplicateModuleSlug(moduleSlug)) {
          this.error = 'Modul produk sudah ada. Pilih modul tersebut dari daftar.'
          return
        }
      }

      if (!product.parentSlug) {
        this.error = 'Pilih modul produk terlebih dahulu.'
        return
      }

      if (!product.detailSlug) {
        this.error = 'Nama produk belum valid.'
        return
      }

      if (isDuplicateProductName(product.parentSlug, product.detailSlug, this.editingId)) {
        this.error = 'Detail produk sudah ada di modul tersebut. Gunakan nama lain.'
        return
      }

      if (this.form.moduleMode === 'new') {
        this.customModules = [
          {
            slug: product.parentSlug,
            name: this.form.newModuleName,
            keywords: `${this.form.newModuleName} ${product.name} ${product.keywords}`.trim(),
            items: [],
            custom: true,
          },
          ...this.customModules,
        ]
        saveCustomModules(this.customModules)
      }

      if (this.editingId) {
        this.products = this.products.map((item) => {
          return item.id === this.editingId ? product : item
        })
      } else {
        this.products = [product, ...this.products]
      }

      saveProducts(this.products)
      this.resetForm()
    },
    editProduct(product) {
      this.editingId = product.id
      this.error = ''
      this.form = {
        moduleMode: 'existing',
        parentSlug: product.parentSlug || product.slug,
        newModuleName: '',
        name: product.name,
        keywords: product.keywords || '',
        itemsText: (product.items || []).join('\n'),
      }
    },
    deleteProduct(id) {
      const product = this.products.find((item) => item.id === id)
      if (!product) return

      const confirmed = window.confirm(`Hapus produk "${product.name}"?`)
      if (!confirmed) return

      this.products = this.products.filter((item) => item.id !== id)
      saveProducts(this.products)

      if (this.editingId === id) this.resetForm()
    },
    getModuleName(parentSlug) {
      return this.modules.find((module) => module.slug === parentSlug)?.name || parentSlug
    },
    openProduct(product) {
      this.$router.push({
        path: `/module/${product.parentSlug}`,
        query: {
          detail: `product:${product.id}`,
        },
      })
    },
  },
}
</script>

<style scoped>
.product-page {
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(280px, 420px) 1fr;
  align-items: start;
  gap: 24px;
}

.product-panel {
  background: white;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.panel-heading p {
  margin: 0 0 4px;
  color: #687686;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.panel-heading h1 {
  margin: 0;
  color: #1d4f80;
  font-size: 1.4rem;
}

.panel-heading span {
  color: #687686;
  font-size: 0.9rem;
  white-space: nowrap;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mode-options {
  display: grid;
  gap: 8px;
}

.mode-options label {
  align-items: center;
  background: #f7f9fb;
  border: 1px solid #e3e8ef;
  border-radius: 6px;
  display: grid;
  flex-direction: row;
  grid-template-columns: 1fr auto;
  padding: 10px 12px;
}

.product-form .mode-options input {
  justify-self: end;
  margin: 0;
  order: 2;
  width: auto;
}

.product-form label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #26323f;
  font-size: 0.9rem;
  font-weight: 700;
}

.product-form input,
.product-form select,
.product-form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccd6e0;
  border-radius: 6px;
  color: #1f2933;
  font: inherit;
  font-weight: 400;
  padding: 11px 12px;
  resize: vertical;
}

.product-form input:focus,
.product-form select:focus,
.product-form textarea:focus {
  border-color: #10b7c5;
  box-shadow: 0 0 0 3px rgba(16, 183, 197, 0.14);
  outline: none;
}

.form-error {
  margin: 0;
  color: #b42318;
  font-size: 0.9rem;
}

.form-actions,
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

button {
  border: 0;
  border-radius: 6px;
  background: #10b7c5;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 10px 14px;
}

.secondary-action,
.ghost-action {
  background: #e8f6f8;
  color: #1d4f80;
}

.danger-action {
  background: #fff1f0;
  color: #b42318;
}

.empty-state {
  border: 1px dashed #ccd6e0;
  border-radius: 8px;
  color: #687686;
  padding: 28px;
  text-align: center;
}

.product-list {
  display: grid;
  gap: 12px;
}

.product-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  padding: 16px;
}

.product-card h2 {
  margin: 0 0 6px;
  color: #26323f;
  font-size: 1rem;
}

.product-card p {
  margin: 0;
  color: #687686;
  font-size: 0.88rem;
}

.product-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #26323f;
  font-size: 0.9rem;
}

@media (max-width: 860px) {
  .product-page {
    grid-template-columns: 1fr;
  }

  .product-card {
    flex-direction: column;
  }
}
</style>
