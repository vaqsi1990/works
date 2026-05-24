import Modal from './Modal'
import type { WorkEntry } from '../types/work'

type Props = {
  work: WorkEntry | null
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}



export default function DeleteConfirmModal({
  work,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal open={work !== null} title="Удалить запись?" onClose={onClose}>
      {work && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Вы уверены, что хотите удалить эту запись из журнала? Это действие нельзя
            отменить.
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? 'Удаление…' : 'Удалить'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
