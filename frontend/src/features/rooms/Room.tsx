import Image from '@components/Image'
import { Box, Typography } from '@mui/material'
import { setCurrentChat } from '@stores/chatSlice'
import { AppDispatch } from '@stores/index'
import React from 'react'
import { useDispatch } from 'react-redux'
// import { useDispatch } from 'react-redux'
// import { ChannelModel } from 'src/models/Channel'
import { Link } from 'react-router-dom'
import { RoomModel } from 'src/models/ChatsModel'
import AvatarUser from '../../assets/images/user/avatar.jpg'
// import { saveChannel } from '@stores/actions/chats'
// import { AppDispatch } from '../../../stores'

type ChannelProps = {
  room: RoomModel
}

const Channel: React.FC<ChannelProps> = ({ room }) => {
  // Render thông tin của kênh tại đây
  // console.log('channel child', channel)
  const dispatch = useDispatch<AppDispatch>()

  // // Hàm onClick lưu thông tin kênh khi người dùng nhấp vào
  const handleChannelClick = (room: RoomModel) => {
    console.log('room', room)
    dispatch(setCurrentChat(room))
  }

  return (
    <Link to={`/chats/${room.roomId}`} className='link-channel' onClick={() => handleChannelClick(room)}>
      <Box className='room-list__channel'>
        <Box className='room-list__channel__top'>
          <Box className='left'>
            <Image src={AvatarUser} alt='' className='channel-avatar' width='60px' height='60px' />
          </Box>
          <Box className='right'>
            <Typography variant='h3' component='h3'>
              {room.roomName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  )
}

export default React.memo(Channel)
