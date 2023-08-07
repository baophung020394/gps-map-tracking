import { Box } from '@mui/material'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setShouldScrollToBottom } from '@stores/chatSlice'
import { RootState, AppDispatch } from '@stores/index'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageModel } from 'src/models/ChatsModel'
import { UserParams } from 'src/models/User'
import Chat from './Chat'

interface ChatsListProps {
  messageList: MessageModel[] | undefined
  userInfo: UserParams | null
}

const ChatsList: React.FC<ChatsListProps> = ({ userInfo, messageList }) => {
  const shouldScrollToBottom = useSelector((state: RootState) => state.chat.shouldScrollToBottom)
  const chatsListRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const isScrolledToBottomRef = useRef(false)

  const addTimeMarkers = (messageList: MessageModel[]): MessageModel[] => {
    let lastDate: string | null = null
    const messagesWithMarkers: MessageModel[] = []

    for (const message of messageList) {
      const regDate = message.date

      if (regDate) {
        const messageDate = new Date(regDate).toLocaleDateString()

        if (messageDate !== lastDate) {
          messagesWithMarkers.push({
            ...message, // copy all existing properties
            dateMarker: messageDate, // add the dateMarker property
            messageType: '99'
          })
          lastDate = messageDate
        }

        messagesWithMarkers.push(message)
      }
    }

    return messagesWithMarkers
  }

  const messagesWithMarkers = useMemo(() => addTimeMarkers(messageList || []), [messageList])

  useEffect(() => {
    if (chatsListRef.current && shouldScrollToBottom) {
      const element = chatsListRef.current
      // element.scrollIntoView()
      setTimeout(() => {
        element.scrollTop = element.scrollHeight
      }, 100)
    }
  }, [messagesWithMarkers, shouldScrollToBottom])

  const handleScroll = () => {
    if (chatsListRef.current) {
      const element = chatsListRef.current
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const isScrolledToBottom = Math.ceil(element.scrollHeight - element.scrollTop) === element.clientHeight

      // Kiểm tra nếu giá trị thay đổi từ false thành true thì dispatch
      // if (isScrolledToBottom && !isScrolledToBottomRef.current) {
      //   dispatch(setShouldScrollToBottom(isScrolledToBottom))
      // }
      dispatch(setShouldScrollToBottom(isScrolledToBottom))
      // Lưu giá trị mới vào biến ref
      isScrolledToBottomRef.current = isScrolledToBottom
    }
  }

  return messageList !== undefined ? (
    <Box
      className={`chat-room__list ${messageList !== undefined ? 'animation-active' : ''}`}
      ref={chatsListRef}
      onScroll={handleScroll}
    >
      {messagesWithMarkers.map((message, index) => (
        <Chat key={`${message.chatId}-${index}`} userInfo={userInfo} message={message} />
      ))}
    </Box>
  ) : null
}

export default memo(ChatsList)
