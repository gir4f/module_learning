<template>
  <header class="app-header">
    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-label="Buka menu navigasi"
      @click="menuOpen = !menuOpen"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <RouterLink class="brand-link" to="/" aria-label="Beranda">
      <img
        class="brand-logo"
        src="@/assets/images/Gitronikbgputih.jpg"
        alt="PT. Gitronik Dimindo Indonesia"
      />
    </RouterLink>

    <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>

    <aside class="side-menu" :class="{ open: menuOpen }" aria-label="Navigasi utama">
      <div class="search-wrap">
        <input
          v-model="search"
          placeholder="Search..."
          @keydown.enter="pickFirst"
          autocomplete="off"
        />
        <ul v-if="suggestions.length" class="suggestions">
          <li
            v-for="suggestion in suggestions"
            :key="suggestion.key"
            @click="goToSuggestion(suggestion)"
          >
            <strong>{{ suggestion.label }}</strong>
            <span>{{ suggestion.moduleName }}</span>
          </li>
        </ul>
      </div>

      <nav>
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <a href="#sop" @click.prevent="goToModule('alur-kerja')">SOP</a>

        <h2>Produk</h2>
        <button
          v-for="module in productModules"
          :key="module.slug"
          type="button"
          @click="goToModule(module.slug)"
        >
          {{ module.name }}
        </button>
      </nav>
    </aside>
  </header>
</template>

<script>
import { modules, normalize, matchesQuery } from '@/data/modules'

export default {
  data() {
    return {
      search: '',
      menuOpen: false,
      modules,
    }
  },
  computed: {
    productModules() {
      return this.modules.filter((module) => module.slug !== 'alur-kerja')
    },
    suggestions() {
      const q = normalize(this.search)
      if (!q) return []

      const result = []
      for (const module of this.modules) {
        for (const item of module.items || []) {
          if (matchesQuery([item, module.name, module.keywords], q)) {
            result.push({
              key: `${module.slug}-${item}`,
              slug: module.slug,
              label: item,
              moduleName: module.name,
            })
          }
        }

        if (matchesQuery([module.name, module.keywords], q)) {
          result.push({
            key: `${module.slug}-module`,
            slug: module.slug,
            label: module.name,
            moduleName: module.slug === 'alur-kerja' ? 'SOP' : 'Produk',
          })
        }
      }

      const seen = new Set()
      return result.filter((suggestion) => {
        const key = `${suggestion.slug}-${suggestion.label}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }).slice(0, 10)
    },
  },
  methods: {
    closeMenu() {
      this.menuOpen = false
    },
    goToModule(slug) {
      this.closeMenu()
      this.$router.push(`/module/${slug}`)
    },
    goToSuggestion(suggestion) {
      this.search = suggestion.label
      this.goToModule(suggestion.slug)
    },
    pickFirst() {
      if (this.suggestions.length) this.goToSuggestion(this.suggestions[0])
    },
  },
}
</script>

<style scoped>
.app-header {
  --header-height: 96px;
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);
  background: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 8px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #e3e8ef;
  box-shadow: 0 2px 14px rgba(13, 37, 61, 0.1);
}

.brand-link {
  display: inline-flex;
  align-items: center;
}

.brand-logo {
  display: block;
  width: auto;
  height: 72px;
}

.menu-toggle {
  width: 56px;
  height: 56px;
  border: 2px solid #10b7c5;
  border-radius: 14px;
  background: #10b7c5;
  display: grid;
  place-content: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.menu-toggle[aria-expanded="true"] {
  background: white;
  box-shadow: 0 8px 22px rgba(13, 37, 61, 0.2);
}

.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: white;
  border-radius: 999px;
}

.menu-toggle[aria-expanded="true"] span {
  background: #10b7c5;
}

.menu-backdrop {
  position: fixed;
  inset: var(--header-height) 0 0;
  background: rgba(12, 27, 42, 0.12);
}

.side-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  width: min(318px, 92vw);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(7px);
  border-right: 1px solid #e3e8ef;
  box-shadow: 8px 0 22px rgba(13, 37, 61, 0.12);
  transform: translateX(-104%);
  transition: transform 0.2s ease;
  padding: 18px;
  overflow-y: auto;
}

.side-menu.open {
  transform: translateX(0);
}

.search-wrap {
  position: relative;
  margin-bottom: 22px;
}

.search-wrap input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccd6e0;
  border-radius: 6px;
  padding: 12px 14px;
  color: #1f2933;
  font-size: 1rem;
  outline: none;
}

.search-wrap input:focus {
  border-color: #10b7c5;
  box-shadow: 0 0 0 3px rgba(16, 183, 197, 0.14);
}

.suggestions {
  list-style: none;
  margin: 8px 0 0;
  padding: 4px 0;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  background: white;
  box-shadow: 0 8px 22px rgba(13, 37, 61, 0.12);
}

.suggestions li {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  color: #2c3440;
  cursor: pointer;
}

.suggestions li:hover {
  background: #edf9fb;
}

.suggestions strong {
  font-size: 0.9rem;
}

.suggestions span {
  color: #687686;
  font-size: 0.78rem;
}

nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

nav a,
nav button {
  width: 100%;
  border: 0;
  background: transparent;
  color: #5f6368;
  text-align: left;
  text-decoration: none;
  font: inherit;
  font-size: 1rem;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}

nav a {
  color: #333842;
  font-weight: 700;
}

nav button:hover,
nav a:hover {
  background: #edf9fb;
  color: #1d4f80;
}

nav h2 {
  margin: 22px 0 8px;
  padding: 0 10px;
  color: #23272f;
  font-size: 1.05rem;
}

@media (max-width: 720px) {
  .app-header {
    --header-height: 80px;
    padding: 8px 12px;
  }

  .brand-logo {
    width: auto;
    height: 58px;
  }

  .menu-toggle {
    width: 50px;
    height: 50px;
    border-radius: 12px;
  }

  .menu-backdrop {
    inset: var(--header-height) 0 0;
  }

  .side-menu {
    top: var(--header-height);
  }
}
</style>
