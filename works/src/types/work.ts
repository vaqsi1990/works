export type WorkType = {
  id: number
  name: string
  unit: string
}

export type WorkEntry = {
  id: number
  workDate: string
  workTypeId: number
  workName: string
  volume: number
  unit: string
  performer: string
  createdAt: string
}

export type WorkEntryInput = {
  workDate: string
  workTypeId: number
  workName: string
  volume: number
  unit: string
  performer: string
}
