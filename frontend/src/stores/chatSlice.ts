// src/store/channelSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoomModel } from 'src/models/ChatsModel'

interface ChatState {
  currentChat: RoomModel | null
}

const initialState: ChatState = {
  currentChat: null
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat(state, action: PayloadAction<RoomModel>) {
      state.currentChat = action.payload
    }
  }
})

export const { setCurrentChat } = chatSlice.actions

export default chatSlice.reducer
