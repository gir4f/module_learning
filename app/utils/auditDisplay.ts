export const ACTION_VERB_MAP: Record<string, string> = {
  CREATE: 'menambah',
  UPDATE: 'mengedit',
  DELETE: 'menghapus',
}

export const ENTITY_TYPE_MAP: Record<string, string> = {
  MODULE: 'modul',
  MODULE_DETAIL: 'varian produk',
  COMPONENT_ITEM: 'komponen',
  ATTACHMENT: 'lampiran',
}

export function resolveActorDisplay(entry: { actorName: string | null; actorEmail: string }): string {
  if (entry.actorName && entry.actorName.trim()) return entry.actorName.trim()
  if (entry.actorEmail && entry.actorEmail.trim()) return entry.actorEmail.trim()
  return 'Pengguna dihapus'
}
