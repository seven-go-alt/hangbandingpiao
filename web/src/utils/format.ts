export function formatPrice(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  return `¥${value.toFixed(2)}`
}

export function formatDateTime(value?: string) {
  if (!value) return '—'
  return value.replace('T', ' ').slice(0, 16)
}

export function pickFirstImage(value?: string) {
  if (!value) return ''
  return value.split(',')[0] || ''
}
