import { AddressModel } from '@models/address-model'
import { Box, Typography } from '@mui/material'
import { memo } from 'react'

type AddressProps = {
  address: AddressModel
}

const Address: React.FC<AddressProps> = ({ address }) => {
  return (
    <Box className='addresses--address'>
      <Typography component='p'>
        Device:
        <Typography component='span'>{address.name}</Typography>
      </Typography>

      {address.Histories?.length > 0 && (
        <>
          <Typography component='p'>
            Address:
            <Typography component='span'>{address.Histories[0].address}</Typography>
          </Typography>
          <Typography component='p'>
            Lat/lng:
            <Typography component='span'>
              {address.Histories[0].latitude} - {address.Histories[0].longitude}
            </Typography>
          </Typography>
        </>
      )}
      {address.HistoryLasts &&
        address.HistoryLasts?.length > 0 && ( // Kiểm tra nếu Histories tồn tại và không rỗng
          <>
            <Typography component='p'>
              Address:
              <Typography component='span'>{address.HistoryLasts[0].address}</Typography>
            </Typography>
            <Typography component='p'>
              Lat/lng:
              <Typography component='span'>
                {address.HistoryLasts[0].latitude} - {address.HistoryLasts[0].longitude}
              </Typography>
            </Typography>
          </>
        )}
      <Typography component='p'>
        Date:
        <Typography component='span'>2023-03-10 19:23:24</Typography>
      </Typography>
      <Typography component='p'>
        Status:
        <Typography component='span' className='status'>
          Parking
        </Typography>
      </Typography>
    </Box>
  )
}

export default memo(Address)
