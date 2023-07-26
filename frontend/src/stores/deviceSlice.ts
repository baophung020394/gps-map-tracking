// src/stores/addressSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DeviceModel } from 'src/models/device-model'

interface AddressState {
  deviceList: DeviceModel[]
}

const initialState: AddressState = {
  deviceList: []
}

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setAddressListAction(state, action: PayloadAction<DeviceModel[]>) {
      state.deviceList = action.payload
    }
  }
})

export const { setAddressListAction } = deviceSlice.actions

export default deviceSlice.reducer
