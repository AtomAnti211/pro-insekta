import type { Customer } from "./customer"

export interface Location {
  id: number
  locationName: string
  locationCustomer: Customer
  locationPostCode: number
  locationCity: string
  locationAddress: string
  locationMail: string
  locationtyURL: string
  
  locationLat: number | null;   
  locationLng: number | null;   

}
