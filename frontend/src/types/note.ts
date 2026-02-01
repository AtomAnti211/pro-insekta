import type { Activity } from "./activity"

export interface Note {
  id: number
  noteName: string
  noteActivity: Activity
  notePhone: string
  noteAddress: string
  noteCreated: string
  noteFinished: boolean
}
