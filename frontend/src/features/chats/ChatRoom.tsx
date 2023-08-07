import LoadingAnimation from '@components/Loader'
import { SocketResponse } from '@hooks/useSocket'
import { Box } from '@mui/material'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { addMessageToStateListMessage, setShouldScrollToBottom, setStateListMessage } from '@stores/chatSlice'
import { AppDispatch, RootState } from '@stores/index'
import React, { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MessageContent, MessageModel } from 'src/models/ChatsModel'
import RequestSocket from 'src/models/Common'
import { UserParams } from 'src/models/User'
import Chatbar from './Chatbar'
import './chats.scss'
import ChatsList from './ChatsList'
import Messenger from './Messenger'

type Params = Record<string, unknown>

interface ChatRoomProps {
  // Các props của bạn
  id: string
  userInfo: UserParams | null
  sendSocketMessage: (event: string, message: RequestSocket<Params>) => void
  lastMessage: SocketResponse<MessageModel[]> | null
}

const ChatRoom: React.FC<ChatRoomProps> = ({ id, userInfo, lastMessage, sendSocketMessage }) => {
  // const [messageList, setMessageList] = useState<MessageModel[] | undefined>(undefined)
  const stateListMessage = useSelector((state: RootState) => state.chat.stateListMessage)
  const dispatch = useDispatch<AppDispatch>()

  const sendMessage = useCallback(
    (messageContent: MessageContent) => {
      const { attachment, type, userName, content, userId } = messageContent
      const request: RequestSocket<Params> = {
        ptGroup: 32345,
        ptCommand: 32346,
        params: {
          senderId: userId,
          senderName: userName,
          roomId: id,
          chatType: type,
          messageType: '0',
          message: content,
          attachment: attachment
        }
      }
      sendSocketMessage('message', request)

      dispatch(setShouldScrollToBottom(true))
    },
    [sendSocketMessage, id, dispatch]
  )

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.ptCommand) {
        case 32348:
          // Lưu danh sách tin nhắn vào stateListMessage khi vào phòng chat lần đầu
          dispatch(setStateListMessage({ roomId: id, messages: lastMessage.params?.flat() }))
          break

        case 22347:
        case 32347:
          dispatch(addMessageToStateListMessage({ roomId: id, message: lastMessage.params }))
          break

        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, dispatch])

  const previousListMessage = stateListMessage[id] || []

  // Check stateListMessage have key 'id' or no key 'id'
  // Or  stateListMessage[id] is null/undefined return true => call socket get list
  const shouldFetchChatList = !stateListMessage[id] || stateListMessage[id].length !== previousListMessage.length
  // const shouldFetchChatList = !(id in stateListMessage) || stateListMessage[id].length !== previousListMessage.length

  useEffect(() => {
    // Khi vào phòng chat, gọi socket để lấy danh sách tin nhắn của phòng đó
    if (id) {
      const fetchChatList = async () => {
        const request: RequestSocket<Params> = {
          ptGroup: 32345,
          ptCommand: 32348,
          params: {
            userId: userInfo?.id,
            roomId: id
          }
        }

        sendSocketMessage('message', request)
      }

      fetchChatList()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (shouldFetchChatList) {
      // Gọi lại socket để lấy danh sách tin nhắn mới nếu cần
      const fetchChatList = async () => {
        const request: RequestSocket<Params> = {
          ptGroup: 32345,
          ptCommand: 32348,
          params: {
            userId: userInfo?.id,
            roomId: id
          }
        }

        sendSocketMessage('message', request)
      }

      fetchChatList()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchChatList])

  return (
    <Box className='chat-room'>
      <Chatbar />
      {stateListMessage && stateListMessage[id] !== undefined ? (
        <ChatsList userInfo={userInfo} messageList={stateListMessage[id]} />
      ) : (
        <LoadingAnimation />
      )}
      <Messenger userInfo={userInfo} onSubmit={sendMessage} />
    </Box>
  )
}

export default memo(ChatRoom)
