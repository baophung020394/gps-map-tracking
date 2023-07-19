// src/store/channelSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MapState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentMap: any
}

const initialState: MapState = {
  currentMap: null
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCurrentMap(state, action: PayloadAction<any>) {
      state.currentMap = action.payload
    }
  }
})

export const { setCurrentMap } = mapSlice.actions

export default mapSlice.reducer
