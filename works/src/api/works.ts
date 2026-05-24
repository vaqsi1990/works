import type { WorkEntry, WorkEntryInput, WorkType } from '../types/work'
import { filterWorksByDate, sortWorks } from '../utils/work'

const API = '/api/works'

export type WorkFilters = {
  dateFrom?: string
  dateTo?: string
  workTypeId?: number
  sort?: 'asc' | 'desc'
}

export async function fetchWorkTypes(): Promise<WorkType[]> {
  const res = await fetch(`${API}/types`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load work types')
  return res.json()
}

export async function fetchWorks(filters: WorkFilters = {}): Promise<WorkEntry[]> {
  const params = new URLSearchParams()
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.workTypeId) params.set('workTypeId', String(filters.workTypeId))
  if (filters.sort) params.set('sort', filters.sort)

  const query = params.toString()
  const url = query ? `${API}?${query}` : API
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load works')
  const data: WorkEntry[] = await res.json()
  const filtered = filterWorksByDate(data, filters)
  const sort = filters.sort ?? 'desc'
  return sortWorks(filtered, sort)
}

function toApiBody(data: WorkEntryInput) {
  return {
    workDate: data.workDate,
    workTypeId: data.workTypeId,
    workName: data.workName,
    unit: data.unit,
    volume: data.volume,
    performer: data.performer,
  }
}

export async function createWork(data: WorkEntryInput): Promise<WorkEntry> {
  const res = await fetch(`${API}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiBody(data)),
  })
  if (!res.ok) throw new Error('Failed to create work')
  return res.json()
}

export async function updateWork(
  id: number,
  data: WorkEntryInput,
): Promise<WorkEntry> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiBody(data)),
  })
  if (!res.ok) throw new Error('Failed to update work')
  return res.json()
}

export async function deleteWork(id: number): Promise<void> {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete work')
}
