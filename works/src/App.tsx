import { useCallback, useEffect, useState } from 'react'
import {
  createWork,
  deleteWork,
  fetchWorks,
  updateWork,
  type WorkFilters,
} from './api/works'
import Header from './components/Header'
import Modal from './components/Modal'
import WorkFiltersBar from './components/WorkFilters'
import WorkForm from './components/WorkForm'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import WorkTable from './components/WorkTable'
import type { WorkEntry, WorkEntryInput } from './types/work'
import { entryToFormInput } from './utils/work'

function App() {
  const [works, setWorks] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null)
  const [filters, setFilters] = useState<WorkFilters>({ sort: 'desc' })
  const [deleteTarget, setDeleteTarget] = useState<WorkEntry | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadWorks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWorks(filters)
      setWorks(data)
    } catch {
      setError('Не удалось загрузить журнал. Проверьте, что backend запущен.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadWorks()
  }, [loadWorks])

  function openCreate() {
    setEditingEntry(null)
    setFormOpen(true)
  }

  function openEdit(work: WorkEntry) {
    setEditingEntry(work)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingEntry(null)
  }

  async function handleSubmit(data: WorkEntryInput) {
    if (editingEntry) {
      await updateWork(editingEntry.id, data)
    } else {
      await createWork(data)
    }
    await loadWorks()
    closeForm()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setError(null)
    try {
      await deleteWork(deleteTarget.id)
      setWorks((prev) => prev.filter((w) => w.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setError('Не удалось удалить запись')
    } finally {
      setDeleting(false)
    }
  }

  const isEditing = editingEntry !== null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Список работ</h2>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              + Новая запись
            </button>
          </div>

          <Modal
            open={formOpen}
            title={isEditing ? 'Редактировать запись' : 'Новая запись'}
            onClose={closeForm}
          >
            <WorkForm
              key={editingEntry?.id ?? 'new'}
              initialValues={
                editingEntry ? entryToFormInput(editingEntry) : undefined
              }
              submitLabel={isEditing ? 'Обновить' : 'Сохранить'}
              onSubmit={handleSubmit}
              onSuccess={closeForm}
            />
          </Modal>

          <DeleteConfirmModal
            work={deleteTarget}
            loading={deleting}
            onClose={() => !deleting && setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />

          <WorkFiltersBar filters={filters} onChange={setFilters} />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <WorkTable
            works={works}
            loading={loading}
            onEdit={openEdit}
            onDeleteRequest={setDeleteTarget}
          />
        </section>
      </main>
    </div>
  )
}

export default App
