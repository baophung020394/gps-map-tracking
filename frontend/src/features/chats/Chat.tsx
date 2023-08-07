import Image from '@components/Image'
import useFormatDate from '@hooks/useFormatDate'
import { Box, Typography } from '@mui/material'
import React, { FC, memo, useCallback } from 'react'
import { MessageModel } from 'src/models/ChatsModel'
import { UserParams } from 'src/models/User'
import AvatarUser from '../../assets/images/user/avatar.jpg'
import FileMessage, { AttachmentFile } from './components/FileMessage'
import ImageMessage, { Attachment } from './components/ImageMessage'
import JoinMessage from './components/JoinMessage'
interface ChatProps {
  message: MessageModel
  userInfo: UserParams | null
}

const Chat: FC<ChatProps> = ({ message, userInfo }) => {
  // Render message content, for example:
  // const { id } = useParams()
  const avtUserUrl = AvatarUser
  const formattedDate = useFormatDate(message?.date || '')

  /**
   * Check message owner
   */
  const isAuthorOf = useCallback(
    (message: MessageModel) => {
      const cloneMessage = { ...message }
      cloneMessage.ownerId = message.senderId ? message.senderId : message.ownerId
      return cloneMessage?.ownerId === userInfo?.id ? 'chat-right' : 'chat-left'
    },
    [userInfo?.id]
  )

  const renderContent = useCallback(() => {
    switch (message.messageType) {
      case '0':
        return (
          <Box className='message--contents__content'>
            <Box className='message--wrapper'>
              <Typography component='p'>{message.content}</Typography>
            </Box>
          </Box>
        )
      //   case '1':
      //     // Replace with your custom component for rendering text and emoji
      //     return <EmojiMessage message={message} />
      case '2':
        if (message.messageType === '2' && message.attachment) {
          const attachment: Attachment = JSON.parse(message.attachment)
          return (
            <Box className='message--contents__content'>
              <Box className='message--wrapper'>
                <ImageMessage attachment={attachment} />
              </Box>
            </Box>
          )
        }
        break
      case '3':
        if (message.attachment) {
          const attachment: AttachmentFile = JSON.parse(message.attachment)

          return (
            <Box className='message--contents__content files'>
              <Box className='message--wrapper'>
                <FileMessage attachment={attachment} />
              </Box>
            </Box>
          )
        }
        break

      case '51':
        return (
          <Box className='message--contents__content notice'>
            <Box className='message--wrapper'>
              <JoinMessage text='enter room' message={message} />
            </Box>
          </Box>
        )

      case '52':
        return (
          <Box className='message--contents__content notice'>
            <Box className='message--wrapper'>
              <JoinMessage text='left' message={message} />
            </Box>
          </Box>
        )
      case '50':
        return (
          <Box className='message--contents__content notice'>
            <Box className='message--wrapper'>
              <JoinMessage text='joined the channel' message={message} />
            </Box>
          </Box>
        )

      case '99':
        return (
          <Box className='message--contents__content date-marker'>
            <Typography component='p'>{message.dateMarker}</Typography>
          </Box>
        )

      default:
        break
    }
  }, [message])

  return (
    <Box className='chat-room__list__messages'>
      <Box className={`message ${isAuthorOf(message)}`}>
        {!['50', '99'].includes(String(message.messageType)) && (
          <Box className='message--avatar'>
            <Image key={avtUserUrl} src={avtUserUrl} alt='' className='chat-user-avatar' width='40px' height='40px' />
          </Box>
        )}

        <Box className='message--contents'>
          {!['50', '99'].includes(String(message.messageType)) && (
            <Box className='message--contents__top'>
              <Typography variant='h4' component='h4'>
                {message.senderName} - {message.senderId ? message.senderId : message?.ownerId}
              </Typography>
              <Typography component='span'>{formattedDate}</Typography>
            </Box>
          )}
          {renderContent()}
        </Box>
      </Box>
    </Box>
  )
}

export default memo(Chat)
