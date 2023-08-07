import Image from '@components/Image'
import { Box, Typography } from '@mui/material'
import { RootState } from '@stores/index'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import AvatarUser from '../../assets/images/user/avatar.jpg'
// import SearchChat from '@features/search/SearchChat'

const Chatbar: React.FC = () => {
  const currentChat = useSelector((state: RootState) => state.chat.currentChat)

  const imageUrl = AvatarUser
  return (
    <Box className='chat-room__bar'>
      <Box className='chat-room__bar__left'>
        <Image
          key={imageUrl} // Add key here
          src={imageUrl}
          alt=''
          className='channel-avatar'
          width='52px'
          height='52px'
        />
        <Box className='chat-room__bar__left__infor'>
          <Typography variant='h3' component='h3'>
            {currentChat?.roomName}
          </Typography>
          <Typography component='p'>
            Created by <Typography component='span'>{currentChat?.userId}</Typography>
          </Typography>
        </Box>
      </Box>
      <Box className='chat-room__bar__right'>
        {/* <SearchChat
          placeholder='Search by channel name'
          userInfo={userInfo}
          sendSocketMessage={sendSocketMessage}
          resetChannelList={resetChannelList}
        /> */}
      </Box>
    </Box>
  )
}

export default memo(Chatbar)
