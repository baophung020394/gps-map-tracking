import Image from '@components/Image'
import { Box, Typography } from '@mui/material'
import React, { FC, memo } from 'react'
import { useParams } from 'react-router-dom'
import { MessageModel } from 'src/models/ChatsModel'

interface JoinMessageProps {
  message: MessageModel
  text?: string
}
const JoinMessage: FC<JoinMessageProps> = ({ text, message }) => {
  const { id } = useParams()
  const imageUrl = `https://moeme-file-dev.aveapp.com/file/api/down_proc.jsp?type=12&userid=${message?.ownerId}&roomid=${id}`

  return (
    <Box className='message--wrapper__join-message'>
      <Image key={imageUrl} src={imageUrl} alt='' className='chat-user-avatar-join' />
      <Typography component='p'>
        <Typography component='span'> {message.senderName}</Typography> {text}
      </Typography>
    </Box>
  )
}

export default memo(JoinMessage)
