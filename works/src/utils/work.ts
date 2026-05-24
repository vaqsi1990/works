import type { WorkEntry, WorkEntryInput } from '../types/work'


export function toDateKey(iso: string): string {
  const d = new Date(iso)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function filterWorksByDate(
  entries: WorkEntry[],
  filters: { dateFrom?: string; dateTo?: string },
): WorkEntry[] {
  return entries.filter((entry) => {
    const key = toDateKey(entry.workDate)
    if (filters.dateFrom && key < filters.dateFrom) return false
    if (filters.dateTo && key > filters.dateTo) return false
    return true
  })
}

export function sortWorks(
  entries: WorkEntry[],
  sort: 'asc' | 'desc' = 'desc',
): WorkEntry[] {
  return [...entries].sort((a, b) => {
    const diff =
      new Date(a.workDate).getTime() - new Date(b.workDate).getTime()
    if (diff !== 0) return sort === 'asc' ? diff : -diff
    return sort === 'asc' ? a.id - b.id : b.id - a.id
  })
}

export function entryToFormInput(entry: WorkEntry): WorkEntryInput {
  const d = new Date(entry.workDate)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return {
    workDate: `${y}-${m}-${day}`,
    workTypeId: entry.workTypeId,
    workName: entry.workName,
    volume: entry.volume,
    unit: entry.unit,
    performer: entry.performer,
  }
}
