// import AddressInput from '@components/AddressInput'
import axiosClient from '@apis/axios'
import CustomButton from '@components/Button'
import Input from '@components/InputFields'
import { SocketResponse, useSocketIO } from '@hooks/useSocket'
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { addAddress, updatePositionLatest } from '@stores/actions/maps'
import { setAddressListAction } from '@stores/deviceSlice'
import { AppDispatch, RootState } from '@stores/index'
import axios from 'axios'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import RequestSocket from 'src/models/Common'
import { DeviceModel } from 'src/models/device-model'
import { UserParams } from 'src/models/User'
import './address.scss'
import Device from './device'
// import { io } from 'socket.io-client'
// import { useSocketIO } from '@hooks/useSocket'

type Data = Record<string, unknown>

interface FormData {
  name: string
  address: string
  latitude: number
  longitude: number
  userId: string
  date: Date
}

interface AddressesProps {
  id?: string
}

const Addresses: React.FC<AddressesProps> = ({ id }) => {
  const { handleSubmit, control, setValue } = useForm<FormData>()
  const [deviceList, setDeviceList] = useState<DeviceModel[]>([])
  const [open, setOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const userJSON: string | null = localStorage.getItem('user')
  const userInfo: UserParams | null = userJSON !== null ? JSON.parse(userJSON) : null
  const token: string | null = localStorage.getItem('token')
  // test google map
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentMap = useSelector((state: RootState) => state.map.currentMap)
  const handleOpenSocket = useCallback(() => {
    console.log('Connected')
    setIsConnected(true)
  }, [])

  const handleCloseSocket = useCallback(() => {
    console.log('Disconnected')
  }, [])

  const handleMessage = useCallback((message: SocketResponse<DeviceModel>) => {
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

  const { lastMessage, sendSocketMessage } = useSocketIO('http://localhost:5005', options, token ?? '')

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

  const onSubmit = async (data: FormData) => {
    // Get lat, long từ API
    console.log(data)
    dispatch(addAddress(data))

    const getLatLong = getRandomCoordinates(currentLat, currentLong, radiusInKm)
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${getLatLong.lat}&lon=${getLatLong.long}`
      )
      const { data } = response
      if (response.status === 200) {
        setValue('name', 'Bus')
        setValue('userId', userInfo?.id || '')
        setValue('address', data.display_name)
        setValue('latitude', data.lat)
        setValue('longitude', data.lon)
      }
      // Ví dụ: Lấy thông tin địa chỉ từ kết quả và cập nhật vào form
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  const handleOpen = async () => {
    setOpen(true)
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${randomCoordinates.lat}&lon=${randomCoordinates.long}`
      )

      console.log('response', response)

      const { data } = response
      // Xử lý dữ liệu trả về từ API tại đây
      console.log('Address data:', data)
      if (response.status === 200) {
        setValue('name', 'Bus')
        setValue('userId', userInfo?.id || '')
        setValue('address', data.display_name)
        setValue('latitude', data.lat)
        setValue('longitude', data.lon)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleQueryLast = () => {
    if (isConnected) {
      const request: RequestSocket<Data> = {
        ptGroup: 12345,
        ptCommand: 12348, // filter 30 day
        params: {
          userId: userInfo?.id
        }
      }
      sendSocketMessage('message', request)
    }
  }

  const handleReset = () => {
    if (isConnected) {
      const request: RequestSocket<Data> = {
        ptGroup: 12345,
        ptCommand: 12346,
        params: {
          userId: userInfo?.id
        }
      }
      sendSocketMessage('message', request)
    }
  }

  const handleUpdatePositionById = async () => {
    console.log('id', id)
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${randomCoordinates.lat}&lon=${randomCoordinates.long}`
      )
      console.log('response', response)
      const { data } = response
      // Xử lý dữ liệu trả về từ API tại đây
      if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataUpdate: any = {
          address: data.display_name,
          latitude: data.lat,
          longitude: data.lon,
          userId: userInfo?.id || '',
          name: 'Bus',
          deviceId: Number(id),
          date: new Date().toISOString()
        }
        dispatch(updatePositionLatest(dataUpdate))
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  const handleDeleteAllData = async () => {
    await axiosClient.delete('/delHisttory')
    await axiosClient.delete('/delHisttoryLast')
    await axiosClient.delete('/delLatest')
    const delDevice = await axiosClient.delete('/delDevice')

    if (delDevice.status === 200 && delDevice.data.message === 'success') {
      const request: RequestSocket<Data> = {
        ptGroup: 12345,
        ptCommand: 12347,
        params: {
          userId: userInfo?.id
        }
      }
      sendSocketMessage('message', request)
    }
  }

  /**
   * Init list address
   */
  useEffect(() => {
    if (isConnected && !id) {
      const request: RequestSocket<Data> = {
        ptGroup: 12345,
        ptCommand: 12347,
        params: {
          id: userInfo?.id,
          role: userInfo?.role
        }
      }
      sendSocketMessage('message', request)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendSocketMessage, isConnected])

  useEffect(() => {
    if (currentMap) {
      setOpen(true)
      setValue('name', 'Bus')
      setValue('userId', userInfo?.id || '')
      setValue('address', currentMap.label)
      setValue('latitude', currentMap.y)
      setValue('longitude', currentMap.x)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMap, setValue])

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.ptCommand) {
        case 12347:
          setDeviceList(lastMessage.params)
          dispatch(setAddressListAction(lastMessage.params))
          break

        case 12348:
          setDeviceList(lastMessage.params)
          dispatch(setAddressListAction(lastMessage.params))
          break

        case 55555:
          localStorage.clear()
          window.location.href = '/'
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
          <h1>Devices: {deviceList.length}</h1>
          <CustomButton
            text='Logout'
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className='btn-add'
          />
          {id ? (
            <CustomButton text='Update position' onClick={handleUpdatePositionById} className='btn-add' />
          ) : (
            <>
              <CustomButton text='Add' onClick={handleOpen} className='btn-add' />
              <CustomButton text='30d' onClick={handleQueryLast} className='btn-add' />
              <CustomButton text='Reset list' onClick={handleReset} className='btn-add' />
              <CustomButton text='Reset Data' onClick={handleDeleteAllData} className='btn-add' />
            </>
          )}
        </Box>
        {/* Component popup hiển thị lên khi bấm CustomButton */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add a new address</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} className='addresses--header__form'>
              {/* <AddressInput /> */}
              <Input name='address' label='Address' control={control} className='input-form' />
              <Input name='latitude' label='Latitude' control={control} className='input-form' />
              <Input name='longitude' label='Longitude' control={control} className='input-form' />
              <Input type='date' name='date' label='' control={control} className='input-form' />
              <CustomButton text='Add' type='submit' />
            </form>
          </DialogContent>
        </Dialog>
      </Box>

      <Box className='addresses--list'>
        {deviceList.map((device: DeviceModel) => (
          <Device key={device.deviceId} device={device} />
        ))}
      </Box>
    </Box>
  )
}

export default memo(Addresses)
