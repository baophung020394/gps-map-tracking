// import AddressInput from '@components/AddressInput'
import CustomButton from '@components/Button'
import Input from '@components/InputFields'
import { SocketResponse, useSocketIO } from '@hooks/useSocket'
import { AddressModel } from '@models/address-model'
import RequestSocket from '@models/Common'
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { addAddress } from '@stores/actions/maps'
import { setAddressListAction } from '@stores/addressSlice'
import { AppDispatch, RootState } from '@stores/index'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Address from './Address'
// import { io } from 'socket.io-client'
import './address.scss'
// import { useSocketIO } from '@hooks/useSocket'

type Data = Record<string, unknown>

interface FormData {
  name: string
  address: string
  latitude: number
  longitude: number
  date: Date
}

const Addresses: React.FC = () => {
  const { handleSubmit, control, setValue } = useForm<FormData>()
  const [addressList, setAddressList] = useState<AddressModel[]>([])
  const [open, setOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentMap = useSelector((state: RootState) => state.map.currentMap)
  const handleOpenSocket = useCallback(() => {
    console.log('Connected')
    setIsConnected(true)
  }, [])

  const handleCloseSocket = useCallback(() => {
    console.log('Disconnected')
  }, [])

  const handleMessage = useCallback((message: SocketResponse<AddressModel>) => {
    console.log('Received message:', message)
  }, [])

  const options = useMemo(
    () => ({
      onOpen: handleOpenSocket,
      onClose: handleCloseSocket,
      onMessage: handleMessage
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleOpenSocket, handleCloseSocket, handleMessage]
  )

  const { lastMessage, sendSocketMessage } = useSocketIO('http://localhost:5005', options)

  function getRandomCoordinates(lat: number, long: number, radiusInKm: number): { lat: number; long: number } {
    // Earth radius in km
    const earthRadius = 6371

    // Convert latitude and longitude from degrees to radians
    const latInRad = (lat * Math.PI) / 180
    const longInRad = (long * Math.PI) / 180

    // Generate a random angle in radians
    const randomAngle = Math.random() * 2 * Math.PI

    // Calculate the new latitude and longitude
    const newLatInRad = latInRad + (radiusInKm / earthRadius) * Math.cos(randomAngle)
    const newLongInRad = longInRad + (radiusInKm / earthRadius) * Math.sin(randomAngle)

    // Convert back to degrees
    const newLat = (newLatInRad * 180) / Math.PI
    const newLong = (newLongInRad * 180) / Math.PI

    return { lat: newLat, long: newLong }
  }

  const currentLat = 10.762622
  const currentLong = 106.660172
  const radiusInKm = 5 // 1km radius
  const randomCoordinates = getRandomCoordinates(currentLat, currentLong, radiusInKm)

  const onSubmit = (data: FormData) => {
    // Get lat, long từ API
    console.log(data)
    dispatch(addAddress(data))

    getRandomCoordinates(currentLat, currentLong, radiusInKm)
    setValue('latitude', randomCoordinates.lat)
    setValue('longitude', randomCoordinates.long)
    setValue('name', 'Bus')
    setValue('address', 'Viet Nam')
    // setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
    setValue('latitude', randomCoordinates.lat)
    setValue('longitude', randomCoordinates.long)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleQueryLast = () => {
    if (isConnected) {
      const request: RequestSocket<Data> = {
        ptGroup: 12347,
        ptCommand: 12348, // filter 30 day
        data: {
          userId: ''
        }
      }
      sendSocketMessage('message', request)
    }
  }

  const handleReset = () => {
    if (isConnected) {
      const request: RequestSocket<Data> = {
        ptGroup: 12346,
        ptCommand: 12345,
        data: {
          userId: ''
        }
      }
      sendSocketMessage('message', request)
    }
  }

  useEffect(() => {
    if (isConnected) {
      const request: RequestSocket<Data> = {
        ptGroup: 12346,
        ptCommand: 12345,
        data: {
          userId: ''
        }
      }
      sendSocketMessage('message', request)
    }
  }, [sendSocketMessage, isConnected])

  useEffect(() => {
    if (currentMap) {
      setOpen(true)
      setValue('name', 'Bus')
      setValue('address', currentMap.label)
      setValue('latitude', currentMap.y)
      setValue('longitude', currentMap.x)
    }
  }, [currentMap, setValue])

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.ptCommand) {
        case 12345:
          setAddressList(lastMessage.data)
          dispatch(setAddressListAction(lastMessage.data))
          break

        case 12348:
          setAddressList(lastMessage.data)
          dispatch(setAddressListAction(lastMessage.data))
          break

        default:
          break
      }
    }
  }, [lastMessage, dispatch])

  return (
    <Box className='addresses'>
      {/* Render list address */}
      <Box className='addresses--header'>
        <Box className='addresses--header__option'>
          <h1>Devices: {addressList.length}</h1>
          <CustomButton text='Add' onClick={handleOpen} className='btn-add' />
          <CustomButton text='30d' onClick={handleQueryLast} className='btn-add' />
          <CustomButton text='Reset' onClick={handleReset} className='btn-add' />
        </Box>
        {/* Component popup hiển thị lên khi bấm CustomButton */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add a new address</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} className='addresses--header__form'>
              {/* <AddressInput /> */}
              <Input name='name' label='Address' control={control} className='input-form' />
              <Input name='latitude' label='Latitude' control={control} className='input-form' />
              <Input name='longitude' label='Longitude' control={control} className='input-form' />
              <Input type='date' name='date' label='' control={control} className='input-form' />
              <CustomButton text='Add' type='submit' />
            </form>
          </DialogContent>
        </Dialog>
      </Box>

      <Box className='addresses--list'>
        {addressList.map((address: AddressModel) => (
          <Address key={address.deviceId} address={address} />
        ))}
      </Box>
    </Box>
  )
}

export default memo(Addresses)
