export function timeAgo(dateString?: string | null) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'

  const diffMs = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day

  if (diffMs < minute) return 'baru saja'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} menit lalu`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} jam lalu`
  if (diffMs < month) return `${Math.floor(diffMs / day)} hari lalu`

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
