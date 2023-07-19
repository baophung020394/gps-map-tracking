import { AddressModel } from '@models/address-model'
import { Box } from '@mui/material'
import { AppDispatch, RootState } from '@stores/index'
import { setCurrentMap } from '@stores/mapSlice'
import L from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/dist/geosearch.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MarkerIcon from '../../assets/images/location-pin.png'

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addressList = useSelector((state: RootState) => state.address.addressList)

  console.log('addressList', addressList)

  useEffect(() => {
    if (!mapRef.current) return // return if div not loaded yet
    // Initialize the map
    const map = L.map(mapRef.current, {
      center: [10.762622, 106.660172], // Coordinates for Ho Chi Minh City
      zoom: 13 // Change this value to adjust the zoom level
    })

    // Initialize tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Initialize GeoSearch control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new (OpenStreetMapProvider as any)()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      showMarker: true,
      retainZoomLevel: false,
      searchLabel: 'Enter address', // customize the search placeholder
      position: 'topright' // position of the search bar
    })

    // Add GeoSearch control to the map
    map.addControl(searchControl)
    // Listen for the result event and log the result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('geosearch/showlocation', function (result: any) {
      console.log('result.location', result.location)
      dispatch(setCurrentMap(result.location))
    })
    // Set custom icon for markers
    const customIcon = L.icon({
      iconUrl: MarkerIcon, // URL to your icon image
      iconSize: [32, 32], // size of the icon
      iconAnchor: [18, 32], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    })

    // Array to store coordinates for polyline
    const coordinates: [number, number][] = []

    // Add markers to map

    addressList.forEach((address: AddressModel) => {
      if (address.Histories) {
        address.Histories.forEach((maps) => {
          const latlng: [number, number] = [maps.latitude, maps.longitude]
          L.marker(latlng, { icon: customIcon }).addTo(map)
          coordinates.push(latlng)
        })
      }

      if (address.HistoryLasts) {
        address.HistoryLasts.forEach((maps) => {
          const latlng: [number, number] = [maps.latitude, maps.longitude]
          L.marker(latlng, { icon: customIcon }).addTo(map)
          coordinates.push(latlng)
        })
      }
    })

    // Add polyline to map
    L.polyline(coordinates, { color: 'red' }).addTo(map)

    // Cleanup on unmount
    return () => {
      map.remove()
    }
  }, [dispatch, addressList])

  return <Box ref={mapRef} width='100%' height='100%' />
}

export default Map
