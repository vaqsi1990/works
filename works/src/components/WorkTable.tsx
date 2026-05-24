import type { WorkEntry } from '../types/work'

type Props = {
  works: WorkEntry[]
  loading: boolean
  onEdit: (work: WorkEntry) => void
  onDeleteRequest: (work: WorkEntry) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU')
}

export default function WorkTable({ works, loading, onEdit, onDeleteRequest }: Props) {
  if (loading) {
    return <p className="text-gray-600">Загрузка…</p>
  }

  if (works.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        Записей пока нет. Добавьте первую запись выше.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-medium">Дата выполнения</th>
            <th className="px-4 py-3 font-medium">Наименование вида работ</th>
            <th className="px-4 py-3 font-medium">Объём</th>
            <th className="px-4 py-3 font-medium">ФИО исполнителя</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {works.map((work) => (
            <tr key={work.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(work.workDate)}</td>
              <td className="px-4 py-3">{work.workName}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {work.volume} {work.unit}
              </td>
              <td className="px-4 py-3">{work.performer}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(work)}
                  className="mr-3 text-violet-600 hover:text-violet-800"
                >
                  Изменить
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(work)}
                  className="text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
