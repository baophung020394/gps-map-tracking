// src/store/channelSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessageModel, RoomModel } from 'src/models/ChatsModel'

interface ChatState {
  currentChat: RoomModel | null
  shouldScrollToBottom: boolean
  stateListMessage: Record<string, MessageModel[]>
}

const initialState: ChatState = {
  currentChat: null,
  stateListMessage: {},
  // currentChatList: null,
  shouldScrollToBottom: true
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat(state, action: PayloadAction<RoomModel>) {
      state.currentChat = action.payload
    },
    setStateListMessage(state, action: PayloadAction<{ roomId: string; messages: MessageModel[] }>) {
      const { roomId, messages } = action.payload
      state.stateListMessage[roomId] = messages
    },
    addMessageToStateListMessage(state, action: PayloadAction<{ roomId: string; message: MessageModel }>) {
      const { roomId, message } = action.payload
      if (state.stateListMessage[roomId]) {
        state.stateListMessage[roomId].push(message)
      } else {
        state.stateListMessage[roomId] = [message]
      }
    },
    // setCurrentChatList(state, action: PayloadAction<MessageModel[]>) {
    //   // So sánh dữ liệu mới và cũ
    //   state.currentChatList = action.payload
    // },
    // clearCurrentChatList(state) {
    //   state.currentChatList = null
    // },
    // addMessageToChatList(state, action: PayloadAction<MessageModel>) {
    //   if (state.currentChatList) {
    //     state.currentChatList.push(action.payload)
    //   }
    // },
    setShouldScrollToBottom(state, action) {
      state.shouldScrollToBottom = action.payload
    }
  }
})

export const { setCurrentChat, setShouldScrollToBottom, setStateListMessage, addMessageToStateListMessage } =
  chatSlice.actions

export default chatSlice.reducer
