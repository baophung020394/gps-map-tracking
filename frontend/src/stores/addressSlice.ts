// src/stores/addressSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddressModel } from '@models/address-model'

interface AddressState {
  addressList: AddressModel[]
}

const initialState: AddressState = {
  addressList: []
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddressListAction(state, action: PayloadAction<AddressModel[]>) {
      state.addressList = action.payload
    }
  }
})

export const { setAddressListAction } = addressSlice.actions

export default addressSlice.reducer
