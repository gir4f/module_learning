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

          <div class="components-editor">
            <div class="editor-heading">
              <h2>Kelengkapan Barang</h2>
              <button type="button" class="secondary-action" @click="addComponent">Tambah Baris</button>
            </div>

            <div class="component-grid component-grid-head">
              <span>Komponen</span>
              <span>Jumlah</span>
              <span>Satuan</span>
              <span>Keterangan</span>
              <span></span>
            </div>

            <div
              v-for="(component, index) in form.components"
              :key="component.id"
              class="component-grid component-row"
            >
              <input v-model.trim="component.name" type="text" placeholder="Nama komponen" />
              <input v-model.trim="component.quantity" type="text" placeholder="1" />
              <input v-model.trim="component.unit" type="text" placeholder="Pcs" />
              <input v-model.trim="component.note" type="text" placeholder="Opsional" />
              <button type="button" class="danger-action icon-action" @click="removeComponent(index)">Hapus</button>
            </div>
          </div>

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
              <p>{{ (product.components || []).length }} komponen</p>
            </div>
            <div class="card-actions">
              <button type="button" @click="openProduct(product)">Lihat</button>
              <button type="button" @click="editProduct(product)">Edit</button>
              <button type="button" class="danger-action" @click="deleteProduct(product.id)">Hapus</button>
            </div>
          </article>
        </div>
      </section>

      <section class="product-panel attachment-panel">
        <div class="panel-heading">
          <div>
            <p>Lampiran</p>
            <h1>Detail Produk</h1>
          </div>
        </div>

        <div class="product-form">
          <label>
            Modul Produk
            <select v-model="attachmentForm.parentSlug" @change="loadSelectedAttachments">
              <option value="" disabled>Pilih modul</option>
              <option v-for="module in productModules" :key="module.slug" :value="module.slug">
                {{ module.name }}
              </option>
            </select>
          </label>

          <label>
            Detail Produk
            <select v-model="attachmentForm.detailKey">
              <option value="" disabled>Pilih detail produk</option>
              <option v-for="detail in attachmentDetailOptions" :key="detail.key" :value="detail.key">
                {{ detail.name }}
              </option>
            </select>
          </label>

          <div class="attachment-grid">
            <form class="attachment-box" @submit.prevent="addImageLink">
              <h2>Gambar</h2>
              <label>
                Upload gambar
                <input type="file" accept="image/*" @change="uploadImage" />
              </label>
              <label>
                Link gambar (opsional)
                <input v-model.trim="attachmentForm.imageUrl" type="url" placeholder="https://contoh.com/gambar.jpg" />
              </label>
              <label>
                Judul gambar
                <input v-model.trim="attachmentForm.imageTitle" type="text" placeholder="Rangkaian, wiring, tabel, dll." />
              </label>
              <button type="submit">Simpan Link Gambar</button>
            </form>

            <form class="attachment-box" @submit.prevent="addSpreadsheetLink">
              <h2>Spreadsheet</h2>
              <label>
                Link spreadsheet
                <input v-model.trim="attachmentForm.spreadsheetUrl" type="url" placeholder="https://docs.google.com/spreadsheets/..." required />
              </label>
              <label>
                Judul spreadsheet
                <input v-model.trim="attachmentForm.spreadsheetTitle" type="text" placeholder="Kelengkapan barang" />
              </label>
              <button type="submit">Simpan Spreadsheet</button>
            </form>
          </div>

          <p v-if="attachmentError" class="form-error">{{ attachmentError }}</p>

          <div v-if="selectedAttachmentImages.length || selectedAttachmentSpreadsheets.length" class="attachment-preview">
            <h2>{{ selectedAttachmentDetailName }}</h2>
            <div v-if="selectedAttachmentImages.length" class="preview-list">
              <article v-for="image in selectedAttachmentImages" :key="image.id">
                <span>{{ image.title }}</span>
                <button type="button" class="danger-action" @click="removeImage(image.id)">Hapus</button>
              </article>
            </div>
            <div v-if="selectedAttachmentSpreadsheets.length" class="preview-list">
              <article v-for="sheet in selectedAttachmentSpreadsheets" :key="sheet.id">
                <a :href="sheet.url" target="_blank" rel="noopener noreferrer">{{ sheet.title }}</a>
                <button type="button" class="danger-action" @click="removeSpreadsheet(sheet.id)">Hapus</button>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import { loadModuleAttachments, saveModuleAttachments } from '@/data/moduleAttachments'
import { modules as staticModules } from '@/data/modules'
import {
  getModuleDetailOptions,
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
      attachments: {
        images: [],
        spreadsheets: [],
      },
      editingId: null,
      error: '',
      attachmentError: '',
      customModules: [],
      attachmentForm: {
        parentSlug: '',
        detailKey: '',
        imageUrl: '',
        imageTitle: '',
        spreadsheetUrl: '',
        spreadsheetTitle: '',
      },
      form: {
        moduleMode: 'existing',
        parentSlug: '',
        newModuleName: '',
        name: '',
        keywords: '',
        components: [
          {
            id: 'initial',
            name: '',
            quantity: '',
            unit: '',
            note: '',
          },
        ],
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
    attachmentDetailOptions() {
      if (!this.attachmentForm.parentSlug) return []

      return getModuleDetailOptions(this.attachmentForm.parentSlug)
    },
    selectedAttachmentDetail() {
      return this.attachmentDetailOptions.find((detail) => detail.key === this.attachmentForm.detailKey)
    },
    selectedAttachmentDetailName() {
      return this.selectedAttachmentDetail?.name || ''
    },
    selectedAttachmentImages() {
      return this.attachments.images.filter((image) => image.detailKey === this.attachmentForm.detailKey)
    },
    selectedAttachmentSpreadsheets() {
      return this.attachments.spreadsheets.filter((sheet) => sheet.detailKey === this.attachmentForm.detailKey)
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
        components: [this.createComponent()],
      }
    },
    createComponent(component = {}) {
      return {
        id: component.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: component.name || '',
        quantity: component.quantity || '',
        unit: component.unit || '',
        note: component.note || '',
      }
    },
    addComponent() {
      this.form.components.push(this.createComponent())
    },
    removeComponent(index) {
      if (this.form.components.length === 1) {
        this.form.components = [this.createComponent()]
        return
      }

      this.form.components.splice(index, 1)
    },
    resolveParentSlug() {
      if (this.form.moduleMode === 'existing') return this.form.parentSlug

      return makeSlug(this.form.newModuleName)
    },
    buildProduct() {
      const detailSlug = makeSlug(this.form.name)
      const components = this.form.components
        .map((component) => {
          return {
            name: component.name.trim(),
            quantity: component.quantity.trim(),
            unit: component.unit.trim(),
            note: component.note.trim(),
          }
        })
        .filter((component) => component.name)

      return {
        id: this.editingId || `${Date.now()}`,
        parentSlug: this.resolveParentSlug(),
        detailSlug,
        slug: this.resolveParentSlug(),
        name: this.form.name,
        keywords: this.form.keywords,
        components,
        items: components.map((component) => component.name),
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

      if (this.hasIncompleteComponent()) {
        this.error = 'Setiap komponen yang diisi wajib memiliki nama, jumlah, dan satuan.'
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
      this.attachmentForm.parentSlug = product.parentSlug
      this.loadSelectedAttachments()
      this.attachmentForm.detailKey = `product:${product.id}`
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
        components: (product.components?.length ? product.components : product.items || []).map((component) => {
          return typeof component === 'string'
            ? this.createComponent({ name: component })
            : this.createComponent(component)
        }),
      }
      if (!this.form.components.length) this.form.components = [this.createComponent()]
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
    hasIncompleteComponent() {
      return this.form.components.some((component) => {
        const hasAnyValue = component.name || component.quantity || component.unit || component.note
        if (!hasAnyValue) return false

        return !component.name || !component.quantity || !component.unit
      })
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
    loadSelectedAttachments() {
      this.attachments = loadModuleAttachments(this.attachmentForm.parentSlug)
      this.attachmentForm.detailKey = this.attachmentDetailOptions[0]?.key || ''
      this.attachmentError = ''
    },
    requireAttachmentTarget() {
      if (this.attachmentForm.parentSlug && this.attachmentForm.detailKey && this.selectedAttachmentDetail) return true

      this.attachmentError = 'Pilih modul dan detail produk terlebih dahulu.'
      return false
    },
    persistAttachments() {
      saveModuleAttachments(this.attachmentForm.parentSlug, this.attachments)
    },
    makeAttachmentId() {
      return `${Date.now()}-${Math.random().toString(36).slice(2)}`
    },
    addImageLink() {
      this.attachmentError = ''
      if (!this.requireAttachmentTarget()) return
      if (!this.attachmentForm.imageUrl) return

      this.attachments.images = [
        {
          id: this.makeAttachmentId(),
          title: this.attachmentForm.imageTitle || 'Gambar detail produk',
          url: this.attachmentForm.imageUrl,
          source: 'url',
          detailKey: this.attachmentForm.detailKey,
          detailName: this.selectedAttachmentDetailName,
        },
        ...this.attachments.images,
      ]
      this.persistAttachments()
      this.attachmentForm.imageUrl = ''
      this.attachmentForm.imageTitle = ''
    },
    uploadImage(event) {
      this.attachmentError = ''
      if (!this.requireAttachmentTarget()) {
        event.target.value = ''
        return
      }

      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.attachmentError = 'File harus berupa gambar.'
        event.target.value = ''
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        this.attachments.images = [
          {
            id: this.makeAttachmentId(),
            title: this.attachmentForm.imageTitle || file.name,
            url: reader.result,
            source: 'file',
            detailKey: this.attachmentForm.detailKey,
            detailName: this.selectedAttachmentDetailName,
          },
          ...this.attachments.images,
        ]
        this.persistAttachments()
        event.target.value = ''
      }
      reader.onerror = () => {
        this.attachmentError = 'Gambar gagal dibaca.'
      }
      reader.readAsDataURL(file)
    },
    addSpreadsheetLink() {
      this.attachmentError = ''
      if (!this.requireAttachmentTarget()) return

      this.attachments.spreadsheets = [
        {
          id: this.makeAttachmentId(),
          title: this.attachmentForm.spreadsheetTitle || 'Spreadsheet kelengkapan barang',
          url: this.attachmentForm.spreadsheetUrl,
          detailKey: this.attachmentForm.detailKey,
          detailName: this.selectedAttachmentDetailName,
        },
        ...this.attachments.spreadsheets,
      ]
      this.persistAttachments()
      this.attachmentForm.spreadsheetUrl = ''
      this.attachmentForm.spreadsheetTitle = ''
    },
    removeImage(id) {
      this.attachments.images = this.attachments.images.filter((image) => image.id !== id)
      this.persistAttachments()
    },
    removeSpreadsheet(id) {
      this.attachments.spreadsheets = this.attachments.spreadsheets.filter((sheet) => sheet.id !== id)
      this.persistAttachments()
    },
  },
}
</script>

<style scoped>
.product-page {
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(620px, 1.15fr) minmax(320px, 0.85fr);
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

.attachment-panel {
  grid-column: 1 / -1;
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

.components-editor {
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  display: grid;
  gap: 10px;
  padding: 14px;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 16px;
}

.attachment-box {
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
}

.attachment-box h2,
.attachment-preview h2 {
  color: #26323f;
  font-size: 0.95rem;
  margin: 0;
}

.attachment-box label {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.attachment-box button {
  align-self: flex-start;
}

.attachment-preview {
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  display: grid;
  gap: 10px;
  padding: 14px;
}

.preview-list {
  display: grid;
  gap: 8px;
}

.preview-list article {
  align-items: center;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
}

.preview-list a,
.preview-list span {
  color: #1d4f80;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.editor-heading {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.editor-heading h2 {
  color: #26323f;
  font-size: 0.95rem;
  margin: 0;
}

.component-grid {
  display: grid;
  grid-template-columns: minmax(160px, 1.45fr) minmax(86px, 0.7fr) minmax(96px, 0.75fr) minmax(140px, 1.15fr) auto;
  gap: 8px;
  min-width: 0;
}

.component-row input {
  min-width: 0;
}

.component-grid-head {
  color: #687686;
  font-size: 0.78rem;
  font-weight: 700;
}

.icon-action {
  padding: 10px 12px;
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

@media (max-width: 1120px) {
  .product-page {
    grid-template-columns: 1fr;
  }

  .product-card {
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .attachment-grid,
  .component-grid,
  .component-grid-head {
    grid-template-columns: 1fr;
  }

  .component-grid-head {
    display: none;
  }
}
</style>
