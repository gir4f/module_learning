const STORAGE_PREFIX = 'modul-ajar-module-attachments:'

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
}

function getStorageKey(slug) {
  return `${STORAGE_PREFIX}${slug}`
}

export function loadModuleAttachments(slug) {
  if (!canUseStorage() || !slug) {
    return {
      images: [],
      spreadsheets: [],
    }
  }

  try {
    const data = JSON.parse(window.localStorage.getItem(getStorageKey(slug)) || '{}')
    return {
      images: Array.isArray(data.images) ? data.images.map(normalizeAttachment) : [],
      spreadsheets: Array.isArray(data.spreadsheets) ? data.spreadsheets.map(normalizeAttachment) : [],
    }
  } catch {
    return {
      images: [],
      spreadsheets: [],
    }
  }
}

export function saveModuleAttachments(slug, attachments) {
  if (!canUseStorage() || !slug) return

  window.localStorage.setItem(getStorageKey(slug), JSON.stringify(attachments))
}

function normalizeAttachment(attachment) {
  return {
    ...attachment,
    detailKey: attachment.detailKey || '',
    detailName: attachment.detailName || 'Detail produk',
  }
}
