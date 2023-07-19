import { HistoryModel } from './history-model'

export interface AddressModel {
  deviceId: string
  name: string
  address: string
  latitude: number
  longitude: number
  Histories: HistoryModel[]
  HistoryLasts?: HistoryModel[]
}
export interface AddressRequest {
  name: string
  address: string
  latitude: number
  longitude: number
}

export interface AddressResponse {
  x: number
  y: number
  label: string
  bounds: [number[], number[]]
  raw: {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    boundingbox: string[]
    lat: string
    lon: string
    display_name: string
    class: string
    type: string
    importance: number
  }
}
