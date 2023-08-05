import CustomButton from '@components/Button'
import ListRoom from '@features/rooms/ListRoom'
import { SocketResponse, useSocketIO } from '@hooks/useSocket'
import { Box, Modal, TextField, Typography } from '@mui/material'
import { RootState } from '@stores/index'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RoomModel } from 'src/models/ChatsModel'
import RequestSocket from 'src/models/Common'
import { UserParams } from 'src/models/User'
import './chat-page.scss'

type Data = Record<string, unknown>

const ChatPage: React.FC = () => {
  const [roomList, setRoomList] = useState<RoomModel[]>([])
  const [infoRoom, setInfoRoom] = useState<RoomModel | undefined>()
  const [isOpenPopupJoin, setIsOpenPopupJoin] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(false)
  const userJSON: string | null = localStorage.getItem('user')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userInfo: UserParams | null = userJSON !== null ? JSON.parse(userJSON) : null
  const token: string | null = localStorage.getItem('token')
  const currentChat = useSelector((state: RootState) => state.chat.currentChat)
  const { id } = useParams()
  // test google map
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenSocket = useCallback(() => {
    console.log('Connected')
    setIsConnected(true)
  }, [])

  const handleCloseSocket = useCallback(() => {
    console.log('Disconnected')
  }, [])

  const handleMessage = useCallback((message: SocketResponse<RoomModel>) => {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lastMessage, sendSocketMessage } = useSocketIO('http://localhost:5005', options, token ?? '')

  const handleClosePopupJoin = () => setIsOpenPopupJoin(false)

  const handleJoinRoom = () => {
    console.log(' infoRoom?.roomId', infoRoom?.roomId)
    const request: RequestSocket<Data> = {
      ptGroup: 22345,
      ptCommand: 22347,
      params: {
        userId: userInfo?.id,
        roomId: infoRoom?.roomId
      }
    }
    sendSocketMessage('message', request)
  }

  useEffect(() => {
    const request: RequestSocket<Data> = {
      ptGroup: 22345,
      ptCommand: 22350,
      params: {
        userId: userInfo?.id
      }
    }
    sendSocketMessage('message', request)
  }, [userInfo?.id, sendSocketMessage])

  useEffect(() => {
    if (lastMessage) {
      console.log('lastMessage', lastMessage)
      // let request: RequestSocket<Data>
      switch (lastMessage.ptCommand) {
        case 22350:
          setRoomList(lastMessage.params)
          break
        case 22351:
          if (Array.isArray(lastMessage.params)) {
            // Lấy thông tin của phòng đầu tiên trong mảng
            setInfoRoom(lastMessage.params[0])
          } else {
            const roomInfo = lastMessage.params as RoomModel
            // setIsOpenPopupJoin(roomInfo.inRoom || false)
            if (roomInfo.inRoom) {
              setIsOpenPopupJoin(false)
            } else {
              setIsOpenPopupJoin(true)
            }
            // Nếu lastMessage.params không phải là mảng, nghĩa là chỉ có thông tin của một phòng duy nhất
            setInfoRoom(roomInfo)
          }
          break
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage])

  useEffect(() => {
    if (currentChat) {
      console.log('currentChat', currentChat)
      const request: RequestSocket<Data> = {
        ptGroup: 22345,
        ptCommand: 22351,
        params: {
          userId: userInfo?.id,
          roomId: currentChat.roomId
        }
      }
      sendSocketMessage('message', request)
    }
  }, [currentChat, userInfo?.id, sendSocketMessage])

  return (
    <Box display='flex' width='100%' className='message-page'>
      {/* Sidebar danh sách phòng */}
      <Box className='message-page__sidebar'>
        {/* Nội dung của sidebar */}
        <Box className='message-page__sidebar__top'>
          <Box className='message-page__sidebar__top__heading'>
            <Box className='heading-wrapper'>
              <Typography variant='h2' component='h2'>
                Chatting
              </Typography>
            </Box>
          </Box>
        </Box>
        <ListRoom roomList={roomList} />
        <CustomButton
          text='Create Room'
          backgroundColor='#2B76FF'
          borderRadius='10px'
          className='btn-add'
          onClick={() => {
            console.log('click test')
            const request: RequestSocket<Data> = {
              ptGroup: 22345,
              ptCommand: 22346,
              params: {
                userId: userInfo?.id,
                roomName: 'Test room 2',
                roomDescription: 'Test room 2 description',
                roomProfileImage: ''
              }
            }
            sendSocketMessage('message', request)
          }}
        />

        <Modal open={isOpenPopupJoin} onClose={handleClosePopupJoin}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 4
            }}
          >
            <Typography variant='h5' mb={2}>
              Room Information
            </Typography>
            <TextField label='Room Name' value={infoRoom?.roomName} fullWidth disabled sx={{ mb: 2 }} />
            <TextField label='Room Description' value={infoRoom?.roomDescription} fullWidth disabled sx={{ mb: 2 }} />
            <CustomButton text='Join Room' onClick={handleJoinRoom} />
          </Box>
        </Modal>
      </Box>

      {/* Component chat chi tiết */}
      <Box className='message-page__room'>
        {id ? (
          <h1>{id}</h1>
        ) : (
          // <ChatRoom id={id} userInfo={userInfo} lastMessage={castedLastMessage} sendSocketMessage={sendSocketMessage} />
          <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
            Please choose a room
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ChatPage
