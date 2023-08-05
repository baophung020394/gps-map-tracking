import { Box } from '@mui/material'
import React from 'react'
import { RoomModel } from 'src/models/ChatsModel'
import './room-style.scss'
import Room from './Room'

type ListRoomProps = {
  roomList: RoomModel[]
}

const ListRoom: React.FC<ListRoomProps> = ({ roomList }) => {
  // Sử dụng `channelList` để render danh sách kênh.

  return (
    <Box className='room-list'>
      {roomList.map((room: RoomModel, index: number) => (
        <Room key={`${room.roomId}-${index}`} room={room} />
      ))}
    </Box>
  )
}

export default React.memo(ListRoom)
