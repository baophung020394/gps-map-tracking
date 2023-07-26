import Addreses from '@features/devices/devices'
import Map from '@features/maps/Map'
import { Box } from '@mui/material'
import './map-page.scss'

const MapPage: React.FC = () => {
  return (
    <Box className='map-page' height='100%'>
      <Box className='map-page__maps'>
        <Map />
      </Box>
      <Box className='map-page__sidebar'>
        <Addreses />
      </Box>
    </Box>
  )
}

export default MapPage
