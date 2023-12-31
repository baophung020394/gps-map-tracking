import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import { DeviceModel } from 'src/models/device-model'

type DeviceProps = {
  device: DeviceModel
}

const Device: React.FC<DeviceProps> = ({ device }) => {
  console.log(device)
  const formattedDate = device.date?.toLocaleString()
  // const date = device ? device.date?.toLocaleString() : ''
  // const formattedDate = date ? format(date, 'HH:mm dd/MM/yyyy') : ''
  // const historyDate = device.Histories?.length > 0 ? new Date(device.Histories[0].date) : null
  // const formattedDate = historyDate ? format(historyDate, 'HH:mm dd/MM/yyyy') : ''
  // const historyLastDate = device.HistoryLasts?.length > 0 ? new Date(device.HistoryLasts[0].date) : null
  // const formattedLastDate = historyLastDate ? format(historyLastDate, 'HH:mm dd/MM/yyyy') : ''

  return (
    <Box className='addresses--address'>
      <Typography component='p'>
        Device:
        <Typography component='span'>{device.deviceName}</Typography>
      </Typography>

      <Typography component='p'>
        Address:
        <Typography component='span'>{device.address}</Typography>
      </Typography>
      <Typography component='p'>
        Lat/lng:
        <Typography component='span'>
          {device.latitude} - {device.longitude}
        </Typography>
      </Typography>
      <Typography component='p'>
        Date:
        <Typography component='span' style={{ fontWeight: 'bold' }}>
          {/* {format(device.date, 'HH:mm dd/MM/yyyy')} */}
          {formattedDate}
        </Typography>
      </Typography>
      {/* {device.Histories?.length > 0 && (
        <>
          <Typography component='p'>
            Address:
            <Typography component='span'>{device.Histories[0].address}</Typography>
          </Typography>
          <Typography component='p'>
            Lat/lng:
            <Typography component='span'>
              {device.Histories[0].latitude} - {device.Histories[0].longitude}
            </Typography>
          </Typography>
          <Typography component='p'>
            Date:
            <Typography component='span' style={{ fontWeight: 'bold' }}>
              {formattedDate}
            </Typography>
          </Typography>
        </>
      )}
      {device.HistoryLasts &&
        device.HistoryLasts?.length > 0 && ( // Kiểm tra nếu Histories tồn tại và không rỗng
          <>
            <Typography component='p'>
              Address:
              <Typography component='span'>{device.HistoryLasts[0].address}</Typography>
            </Typography>
            <Typography component='p'>
              Lat/lng:
              <Typography component='span'>
                {device.HistoryLasts[0].latitude} - {device.HistoryLasts[0].longitude}
              </Typography>
            </Typography>
            <Typography component='p'>
              Date:
              <Typography component='span' style={{ fontWeight: 'bold' }}>
                {formattedLastDate}
              </Typography>
            </Typography>
          </>
        )} */}

      <Typography component='p'>
        Status:
        <Typography component='span' className='status'>
          Parking
        </Typography>
      </Typography>
    </Box>
  )
}

export default memo(Device)
