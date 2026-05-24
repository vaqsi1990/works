import { useEffect, useState } from 'react'
import { fetchWorkTypes, type WorkFilters as Filters } from '../api/works'
import type { WorkType } from '../types/work'

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function WorkFilters({ filters, onChange }: Props) {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([])
  const [typesLoading, setTypesLoading] = useState(true)

  useEffect(() => {
    fetchWorkTypes()
      .then(setWorkTypes)
      .catch(() => setWorkTypes([]))
      .finally(() => setTypesLoading(false))
  }, [])
  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  function reset() {
    onChange({ sort: 'desc' })
  }

  return (
    <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Дата с</span>
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => update('dateFrom', e.target.value || undefined)}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Дата по</span>
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => update('dateTo', e.target.value || undefined)}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex min-w-[12rem] flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Вид работ</span>
        <select
          disabled={typesLoading}
          value={filters.workTypeId ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              workTypeId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
        >
          <option value="">
            {typesLoading ? 'Загрузка…' : 'Все виды работ'}
          </option>
          {workTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Сортировка</span>
        <select
          value={filters.sort ?? 'desc'}
          onChange={(e) => update('sort', e.target.value as 'asc' | 'desc')}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="desc">Сначала новые</option>
          <option value="asc">Сначала старые</option>
        </select>
      </label>

      <button
        type="button"
        onClick={reset}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Сбросить
      </button>
    </div>
  )
}
