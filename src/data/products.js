import { modules, normalize } from './modules'

const STORAGE_KEY = 'modul-ajar-products'
const MODULE_STORAGE_KEY = 'modul-ajar-custom-modules'
const PRODUCT_EVENT = 'products-updated'

export function makeSlug(value) {
  return normalize(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
}

export function loadProducts() {
  if (!canUseStorage()) return []

  try {
    const products = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(products)) return []

    return products.map((product) => {
      return {
        ...product,
        parentSlug: product.parentSlug || product.slug,
        detailSlug: product.detailSlug || makeSlug(product.name),
        items: Array.isArray(product.items) ? product.items : [],
      }
    })
  } catch {
    return []
  }
}

export function saveProducts(products) {
  if (!canUseStorage()) return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  window.dispatchEvent(new CustomEvent(PRODUCT_EVENT, { detail: products }))
}

export function loadCustomModules() {
  if (!canUseStorage()) return []

  try {
    const customModules = JSON.parse(window.localStorage.getItem(MODULE_STORAGE_KEY) || '[]')
    if (!Array.isArray(customModules)) return []

    return customModules.map((module) => {
      return {
        ...module,
        slug: module.slug || makeSlug(module.name),
        keywords: module.keywords || module.name,
        items: Array.isArray(module.items) ? module.items : [],
        custom: true,
      }
    })
  } catch {
    return []
  }
}

export function saveCustomModules(customModules) {
  if (!canUseStorage()) return

  window.localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(customModules))
  window.dispatchEvent(new CustomEvent(PRODUCT_EVENT, { detail: loadProducts() }))
}

export function onProductsUpdated(callback) {
  if (typeof window === 'undefined') return () => {}

  const handler = (event) => callback(event.detail || loadProducts())
  window.addEventListener(PRODUCT_EVENT, handler)
  window.addEventListener('storage', handler)

  return () => {
    window.removeEventListener(PRODUCT_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function getAllModules() {
  return mergeModules([...modules, ...loadCustomModules(), ...getInferredModulesFromProducts(loadProducts())])
}

export function getProductBySlug(slug) {
  return loadProducts().find((product) => product.parentSlug === slug || product.slug === slug)
}

export function getProductsByModule(parentSlug) {
  return loadProducts().filter((product) => product.parentSlug === parentSlug)
}

export function getProductById(id) {
  return loadProducts().find((product) => product.id === id)
}

export function getModuleBySlug(slug) {
  return getAllModules().find((module) => module.slug === slug)
}

export function isDuplicateModuleSlug(slug) {
  return getAllModules().some((module) => module.slug === slug)
}

export function getInferredModulesFromProducts(products) {
  const knownSlugs = new Set([...modules, ...loadCustomModules()].map((module) => module.slug))
  const inferredModules = []

  for (const product of products) {
    if (!product.parentSlug || knownSlugs.has(product.parentSlug)) continue

    knownSlugs.add(product.parentSlug)
    inferredModules.push({
      slug: product.parentSlug,
      name: product.moduleName || product.name,
      keywords: `${product.name} ${product.keywords || ''}`.trim(),
      items: [],
      custom: true,
      inferred: true,
    })
  }

  return inferredModules
}

function mergeModules(moduleList) {
  const seen = new Set()
  return moduleList.filter((module) => {
    if (seen.has(module.slug)) return false
    seen.add(module.slug)
    return true
  })
}

export function getDetailKey(detail) {
  return detail.type === 'custom' ? `product:${detail.id}` : `item:${detail.slug}`
}

export function getModuleDetailOptions(parentSlug) {
  const module = getModuleBySlug(parentSlug)
  const staticItems = (module?.items || []).map((item) => {
    return {
      type: 'static',
      key: `item:${makeSlug(item)}`,
      slug: makeSlug(item),
      name: item,
      moduleName: module.name,
      parentSlug,
    }
  })

  const customProducts = getProductsByModule(parentSlug).map((product) => {
    return {
      type: 'custom',
      key: `product:${product.id}`,
      id: product.id,
      slug: product.detailSlug,
      name: product.name,
      moduleName: module?.name || parentSlug,
      parentSlug,
      product,
    }
  })

  return [...staticItems, ...customProducts]
}

export function isDuplicateProductName(parentSlug, detailSlug, currentId = null) {
  const module = getModuleBySlug(parentSlug)
  const staticDetailExists = (module?.items || []).some((item) => makeSlug(item) === detailSlug)
  const productDetailExists = loadProducts().some((product) => {
    return product.parentSlug === parentSlug && product.detailSlug === detailSlug && product.id !== currentId
  })

  return staticDetailExists || productDetailExists
}
