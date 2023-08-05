// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import mapReducer from './mapSlice'
import deviceReducer from './deviceSlice'
import chatReducer from './chatSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    map: mapReducer,
    device: deviceReducer,
    chat: chatReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
