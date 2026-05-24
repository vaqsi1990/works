import { useEffect, useState, type FormEvent } from 'react'
import { fetchWorkTypes } from '../api/works'
import {
  validateWorkEntryForm,
  type WorkEntryFieldErrors,
} from '../schemas/workEntry'
import type { WorkEntryInput, WorkType } from '../types/work'

type Props = {
  initialValues?: WorkEntryInput
  submitLabel?: string
  onSubmit: (data: WorkEntryInput) => Promise<void>
  onSuccess?: () => void
}

const emptyForm: WorkEntryInput = {
  workDate: '',
  workTypeId: 0,
  workName: '',
  volume: 0,
  unit: '',
  performer: '',
}

const inputClass = (hasError: boolean) =>
  `rounded-md border px-3 py-2 ${
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300'
  }`

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-600">{message}</p>
}

export default function WorkForm({
  initialValues,
  submitLabel = 'Сохранить',
  onSubmit,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<WorkEntryInput>(initialValues ?? emptyForm)
  const [workTypes, setWorkTypes] = useState<WorkType[]>([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<WorkEntryFieldErrors>({})

  useEffect(() => {
    fetchWorkTypes()
      .then(setWorkTypes)
      .catch(() => setError('Не удалось загрузить справочник видов работ'))
      .finally(() => setTypesLoading(false))
  }, [])

  useEffect(() => {
    setForm(initialValues ?? emptyForm)
    setError(null)
    setFieldErrors({})
  }, [initialValues])

  function clearFieldError(key: keyof WorkEntryInput) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function selectWorkType(typeId: number) {
    const found = workTypes.find((t) => t.id === typeId)
    if (!found) return
    setForm((prev) => ({
      ...prev,
      workTypeId: found.id,
      workName: found.name,
      unit: found.unit,
    }))
    clearFieldError('workTypeId')
    clearFieldError('workName')
    clearFieldError('unit')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const validation = validateWorkEntryForm(form)
    if (validation.success === false) {
      setFieldErrors(validation.errors)
      return
    }

    setFieldErrors({})
    setSaving(true)
    try {
      await onSubmit(validation.data)
      if (!initialValues) setForm(emptyForm)
      onSuccess?.()
    } catch {
      setError('Не удалось сохранить запись')
    } finally {
      setSaving(false)
    }
  }

  function updateField<K extends keyof WorkEntryInput>(
    key: K,
    value: WorkEntryInput[K],
  ) {
    clearFieldError(key)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Дата</span>
        <input
          type="date"
          value={form.workDate}
          onChange={(e) => updateField('workDate', e.target.value)}
          className={inputClass(!!fieldErrors.workDate)}
          aria-invalid={!!fieldErrors.workDate}
        />
        <FieldError message={fieldErrors.workDate} />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-gray-700">Вид работ (справочник)</span>
        <select
          disabled={typesLoading}
          value={form.workTypeId || ''}
          onChange={(e) => selectWorkType(Number(e.target.value))}
          className={`${inputClass(!!fieldErrors.workTypeId)} disabled:bg-gray-100`}
          aria-invalid={!!fieldErrors.workTypeId}
        >
          <option value="">
            {typesLoading ? 'Загрузка…' : '— выберите из справочника —'}
          </option>
          {workTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.unit})
            </option>
          ))}
        </select>
        <FieldError message={fieldErrors.workTypeId ?? fieldErrors.workName} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Объём</span>
        <input
          type="number"
          min={0.01}
          step="any"
          value={form.volume || ''}
          onChange={(e) =>
            updateField('volume', e.target.value === '' ? 0 : Number(e.target.value))
          }
          className={inputClass(!!fieldErrors.volume)}
          aria-invalid={!!fieldErrors.volume}
        />
        <FieldError message={fieldErrors.volume} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Ед. изм.</span>
        <input
          type="text"
          value={form.unit}
          onChange={(e) => updateField('unit', e.target.value)}
          placeholder="м³, м², т…"
          className={inputClass(!!fieldErrors.unit)}
          title="Подставляется из справочника, можно изменить вручную"
          aria-invalid={!!fieldErrors.unit}
        />
        <FieldError message={fieldErrors.unit} />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-gray-700">Исполнитель</span>
        <input
          type="text"
          placeholder="Иванов И.И."
          value={form.performer}
          onChange={(e) => updateField('performer', e.target.value)}
          className={inputClass(!!fieldErrors.performer)}
          aria-invalid={!!fieldErrors.performer}
        />
        <FieldError message={fieldErrors.performer} />
      </label>

      <div className="flex items-end justify-end gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving || typesLoading}
          className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? 'Сохранение…' : submitLabel}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
    </form>
  )
}
