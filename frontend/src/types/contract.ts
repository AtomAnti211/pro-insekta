import type { Location } from "./location"
import type { Service } from "./service"

export interface Contract {
  id: number
  contractLocationName: Location
  contractServiceName: Service
  contractPrice: number
  contractStart: string
  contractValid: boolean
  contractFrequencyMonth: number
}
