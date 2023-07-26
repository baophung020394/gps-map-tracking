import { Box } from '@mui/material'
import { AppDispatch, RootState } from '@stores/index'
import { setCurrentMap } from '@stores/mapSlice'
import L from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/dist/geosearch.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DeviceModel } from 'src/models/device-model'
import MarkerIcon from '../../assets/images/location-pin.png'

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const dispatch = useDispatch<AppDispatch>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deviceList = useSelector((state: RootState) => state.device.deviceList)
  const navigate = useNavigate()

  console.log('deviceList', deviceList)

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

    deviceList.forEach((address: DeviceModel) => {
      const latlng: [number, number] = [address.latitude, address.longitude]
      const marker = L.marker(latlng, { icon: customIcon }).addTo(map)
      markersRef.current.push(marker)
      // if (address.Latests) {
      //   address.Latests.forEach((maps) => {
      //     const latlng: [number, number] = [maps.latitude, maps.longitude]
      //     L.marker(latlng, { icon: customIcon }).addTo(map)
      //     coordinates.push(latlng)
      //   })
      // }
      // if (address.Histories) {
      //   address.Histories.forEach((maps) => {
      //     const latlng: [number, number] = [maps.latitude, maps.longitude]
      //     L.marker(latlng, { icon: customIcon }).addTo(map)
      //     coordinates.push(latlng)
      //   })
      // }
      // if (address.HistoryLasts) {
      //   address.HistoryLasts.forEach((maps) => {
      //     const latlng: [number, number] = [maps.latitude, maps.longitude]
      //     L.marker(latlng, { icon: customIcon }).addTo(map)
      //     coordinates.push(latlng)
      //   })
      // }
    })

    // markersRef.current.forEach((marker, index) => {
    //   console.log('first')
    //   marker.on('click', () => {
    //     // Xử lý tùy chỉnh khi click vào marker
    //     console.log('Đã click vào marker!')
    //     console.log(deviceList[index])
    //     // Thực hiện bất kỳ hành động tùy chỉnh nào với marker hoặc dữ liệu liên quan
    //     // Ví dụ, bạn có thể gửi một action để cập nhật Redux store với dữ liệu marker được chọn.
    //   })
    // })

    // Add polyline to map
    // L.polyline(coordinates, { color: 'red' }).addTo(map)

    // Cleanup on unmount
    return () => {
      map.remove()
    }
  }, [dispatch, deviceList])

  useEffect(() => {
    // ...
    markersRef.current.forEach((marker, index) => {
      marker.on('click', () => {
        // Xử lý tùy chỉnh khi click vào marker
        console.log('Đã click vào marker!', deviceList[index])
        // Thực hiện bất kỳ hành động tùy chỉnh nào với marker hoặc dữ liệu liên quan
        // Ví dụ, bạn có thể gửi một action để cập nhật Redux store với dữ liệu marker được chọn.
        const device = deviceList[index]
        if (device) {
          navigate(`/maps/${device.deviceId}`)
        }
      })
    })
    // ...
  }, [dispatch, deviceList, navigate])

  return <Box ref={mapRef} width='100%' height='100%' />
}

export default Map
