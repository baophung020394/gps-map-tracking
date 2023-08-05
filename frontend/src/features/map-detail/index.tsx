import axiosClient from '@apis/axios'
import { Box } from '@mui/material'
import { AppDispatch } from '@stores/index'
import { setCurrentMap } from '@stores/mapSlice'
import L from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/dist/geosearch.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DeviceModel } from 'src/models/device-model'
import { UserParams } from 'src/models/User'
import MarkerIcon from '../../assets/images/location-pin.png'

interface MapDetailProps {
  id: string
}
const MapDetail: React.FC<MapDetailProps> = ({ id }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const dispatch = useDispatch<AppDispatch>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const userJSON: string | null = localStorage.getItem('user')
  const userInfo: UserParams | null = userJSON !== null ? JSON.parse(userJSON) : null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listPath, setListPath] = useState<any>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const initListAddressById = async () => {
    try {
      const delDevice = await axiosClient.post(`/devices/${id}`, {
        userId: userInfo?.id,
        role: userInfo?.role,
        deviceId: id
      })
      console.log('delDevice', delDevice)
      setListPath(delDevice.data.devices)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('error', error)
      if (error.message === 'Request failed with status code 403' && error.response.status === 403) {
        localStorage.clear()
        window.location.href = '/'
      }
    }
  }

  useEffect(() => {
    initListAddressById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      popupAnchor: [-3, -76] // point from whi`ch the popup should open relative to the iconAnchor
    })

    // Array to store coordinates for polyline
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const coordinates: [number, number][] = []

    // Add markers to map

    listPath.forEach((address: DeviceModel) => {
      if (address.history) {
        address.history.forEach((maps) => {
          const latlng: [number, number] = [maps.latitude, maps.longitude]
          const marker = L.marker(latlng, { icon: customIcon }).addTo(map)
          coordinates.push(latlng)
          markersRef.current.push(marker)

          // Add click event to the marker to show popup
          marker.on('click', () => {
            // Create the content for the popup
            const popupContent = `Thông tin của marker: ${maps.address} <br> Lat: ${maps.latitude} <br> Long: ${maps.longitude}`

            // Create a popup and open it at the marker's location
            const popup = L.popup().setLatLng(latlng).setContent(popupContent)
            map.openPopup(popup)
          })
        })
      }
    })

    // Add polyline to map
    L.polyline(coordinates, { color: 'red' }).addTo(map)

    // Cleanup on unmount
    return () => {
      map.remove()
    }
  }, [dispatch, listPath])

  // useEffect(() => {
  //   markersRef.current.forEach((marker, index) => {
  //     console.log('marker', marker)
  //     marker.on('click', () => {
  //       // Xử lý tùy chỉnh khi click vào marker
  //       console.log('Đã click vào marker!', listPath[0].history[index])
  //     })
  //   })
  // }, [dispatch, listPath])

  return <Box ref={mapRef} width='100%' height='100%'></Box>
}

export default MapDetail
