import Addreses from '@features/devices/devices'
import MapDetail from '@features/map-detail'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import './map-detail-page.scss'

const MapDetailPage: React.FC = () => {
  const { id } = useParams()

  return (
    <Box className='map-page' height='100%'>
      <Box className='map-page__maps'>{id ? <MapDetail id={id} /> : null}</Box>
      <Box className='map-page__sidebar'>
        <Addreses id={id} />
      </Box>
    </Box>
  )
}

export default MapDetailPage
