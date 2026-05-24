import { z } from 'zod'

export const workEntryFormSchema = z.object({
  workDate: z.string().min(1, 'Укажите дату выполнения'),
  workTypeId: z
    .number()
    .int()
    .positive('Выберите вид работ из справочника'),
  workName: z.string().min(1, 'Выберите вид работ из справочника'),
  volume: z.coerce.number().positive('Объём должен быть больше 0'),
  unit: z.string().trim().min(1, 'Укажите единицу измерения'),
  performer: z.string().trim().min(1, 'Укажите исполнителя'),
})

export type WorkEntryFormValues = z.infer<typeof workEntryFormSchema>

export type WorkEntryFieldErrors = Partial<
  Record<keyof WorkEntryFormValues, string>
>

export function validateWorkEntryForm(
  data: unknown,
): { success: true; data: WorkEntryFormValues } | { success: false; errors: WorkEntryFieldErrors } {
  const result = workEntryFormSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: WorkEntryFieldErrors = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof WorkEntryFormValues
    if (key && !errors[key]) {
      errors[key] = issue.message
    }
  }
  return { success: false, errors }
}
