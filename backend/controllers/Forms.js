import { z } from 'zod'

import prisma from '../db.js'



const entrySchema = z.object({

  workDate: z.string().min(1, 'Укажите дату выполнения'),

  workName: z.string().min(1, 'Выберите вид работ из справочника'),

  volume: z.coerce.number().positive('Объём должен быть больше 0'),

  unit: z.string().min(1, 'Укажите единицу измерения'),

  performer: z.string().min(1, 'Укажите исполнителя'),

})



const updateSchema = entrySchema.partial()



function formatEntry(entry) {

  return {

    id: entry.id,

    workDate: entry.workDate,

    workName: entry.workType.name,

    unit: entry.unit ?? entry.workType.unit,

    workTypeId: entry.workTypeId,

    volume: entry.volume,

    performer: entry.performer,

    createdAt: entry.createdAt,

  }

}



async function resolveWorkType({ workName, workTypeId }) {

  if (workTypeId) {

    const workType = await prisma.workType.findUnique({

      where: { id: Number(workTypeId) },

    })

    if (workType) return workType

  }

  if (workName) {

    const workType = await prisma.workType.findUnique({

      where: { name: workName },

    })

    if (workType) return workType

  }

  return null

}



function parseDateOnly(value) {

  const d = new Date(value)

  if (Number.isNaN(d.getTime())) {

    throw new Error('Неверный формат даты')

  }

  return d

}



function parseQueryParam(value) {

  if (value === undefined || value === null || value === '') return undefined

  return Array.isArray(value) ? value[0] : String(value)

}



function parseDateStart(value) {

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) throw new Error('Неверный формат даты')

  const [, y, m, d] = match

  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0))

}



function parseDateEnd(value) {

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) throw new Error('Неверный формат даты')

  const [, y, m, d] = match

  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 23, 59, 59, 999))

}



export async function getWorkTypes(req, res) {

  try {

    const types = await prisma.workType.findMany({

      orderBy: { name: 'asc' },

    })

    res.json(types)

  } catch (error) {

    res.status(500).json({ error: 'Не удалось загрузить справочник видов работ' })

  }

}



export async function getAllWorks(req, res) {

  try {

    const dateFrom = parseQueryParam(req.query.dateFrom)

    const dateTo = parseQueryParam(req.query.dateTo)

    const workTypeIdParam = parseQueryParam(req.query.workTypeId)

    const sortParam = parseQueryParam(req.query.sort)

    const order = sortParam === 'asc' ? 'asc' : 'desc'



    const where = {}

    if (dateFrom || dateTo) {

      where.workDate = {}

      if (dateFrom) where.workDate.gte = parseDateStart(dateFrom)

      if (dateTo) where.workDate.lte = parseDateEnd(dateTo)

    }

    if (workTypeIdParam) {

      const workTypeId = Number(workTypeIdParam)

      if (!Number.isNaN(workTypeId)) {

        where.workTypeId = workTypeId

      }

    }



    const works = await prisma.workEntry.findMany({

      where,

      include: { workType: true },

      orderBy: [{ workDate: order }, { id: order }],

    })

    res.json(works.map(formatEntry))

  } catch (error) {

    res.status(500).json({ error: 'Не удалось загрузить журнал' })

  }

}



export async function createWork(req, res) {

  try {

    const parsed = entrySchema.safeParse(req.body)

    if (!parsed.success) {

      return res.status(400).json({

        error: 'Ошибка валидации',

        details: parsed.error.flatten().fieldErrors,

      })

    }



    const { workDate, workName, volume, performer, unit } = parsed.data

    const workType = await resolveWorkType({

      workName,

      workTypeId: req.body.workTypeId,

    })

    if (!workType) {

      return res.status(400).json({ error: 'Выберите вид работ из справочника' })

    }



    const work = await prisma.workEntry.create({

      data: {

        workDate: parseDateOnly(workDate),

        workTypeId: workType.id,

        unit,

        volume,

        performer,

      },

      include: { workType: true },

    })

    res.status(201).json(formatEntry(work))

  } catch (error) {

    res.status(500).json({ error: 'Не удалось создать запись' })

  }

}



export async function updateWork(req, res) {

  try {

    const id = Number(req.params.id)

    if (Number.isNaN(id)) {

      return res.status(400).json({ error: 'Некорректный идентификатор' })

    }



    const parsed = updateSchema.safeParse(req.body)

    if (!parsed.success) {

      return res.status(400).json({

        error: 'Ошибка валидации',

        details: parsed.error.flatten().fieldErrors,

      })

    }



    const data = { ...parsed.data }

    if (data.workDate) data.workDate = parseDateOnly(data.workDate)



    if (data.workName) {

      const workType = await resolveWorkType({

        workName: data.workName,

        workTypeId: req.body.workTypeId,

      })

      if (!workType) {

        return res.status(400).json({ error: 'Выберите вид работ из справочника' })

      }

      delete data.workName

      data.workTypeId = workType.id

    }



    const work = await prisma.workEntry.update({

      where: { id },

      data,

      include: { workType: true },

    })

    res.json(formatEntry(work))

  } catch (error) {

    res.status(500).json({ error: 'Не удалось обновить запись' })

  }

}



export async function deleteWork(req, res) {

  try {

    const id = Number(req.params.id)

    if (Number.isNaN(id)) {

      return res.status(400).json({ error: 'Некорректный идентификатор' })

    }



    await prisma.workEntry.delete({ where: { id } })

    res.status(204).send()

  } catch (error) {

    res.status(500).json({ error: 'Не удалось удалить запись' })

  }

}


