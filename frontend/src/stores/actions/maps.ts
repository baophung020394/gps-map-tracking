import axiosClient from '@apis/axios'
import { AddressRequest, AddressResponse } from '@models/address-model'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setCurrentMap } from '@stores/mapSlice'
import { AppDispatch } from '..'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveChannel = (channel: any) => (dispatch: AppDispatch) => {
  dispatch(setCurrentMap(channel))
}

// actions/login.ts

export const addAddress = createAsyncThunk<void, AddressRequest, { rejectValue: string }>(
  'user/login',
  async (credentials, thunkAPI) => {
    try {
      console.log('credentials', credentials)
      const response = await axiosClient.post<AddressResponse>('/addresses', { params: credentials })

      if (!response) {
        return thunkAPI.rejectWithValue('API response is undefined')
      }

      // Dispatch setUser action to update the user state
      // thunkAPI.dispatch(setUser(response.data.params)) // Pass the entire params as payload
    } catch (error) {
      console.error(error) // Log the error to see more details
      return thunkAPI.rejectWithValue('Failed to send')
    }
  }
)
