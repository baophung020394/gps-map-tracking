import { createContext, useContext } from 'react'
import { Map } from 'leaflet'

interface MapContextValue {
  map: Map | null
}

const MapContext = createContext<MapContextValue | null>(null)

export function useMapContext() {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider')
  }
  return context
}

export function MapProvider({ map, children }: { map: Map | null; children: React.ReactNode }) {
  return <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
}
