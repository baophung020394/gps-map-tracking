import { HistoryModel } from './history-model'

export interface DeviceModel {
  deviceId: string
  deviceName: string
  address: string
  latitude: number
  longitude: number
  history: HistoryModel[]
  Histories: HistoryModel[]
  HistoryLasts: HistoryModel[]
  Latests: HistoryModel[]
  date?: Date
}
export interface DeviceRequest {
  name: string
  address: string
  latitude: number
  longitude: number
}

export interface DeviceUpdateRequest {
  name: string
  address: string
  latitude: number
  longitude: number
  userId: number
  deviceId: number
  date: Date
}

export interface DeviceResponse {
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
