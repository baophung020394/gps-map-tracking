import axiosClient from '@apis/axios'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { setCurrentMap } from '@stores/mapSlice'
import { DeviceRequest, DeviceResponse, DeviceUpdateRequest } from 'src/models/device-model'
import { AppDispatch } from '..'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveChannel = (channel: any) => (dispatch: AppDispatch) => {
  dispatch(setCurrentMap(channel))
}

// actions/login.ts

export const addAddress = createAsyncThunk<void, DeviceRequest, { rejectValue: string }>(
  'user/login',
  async (credentials, thunkAPI) => {
    try {
      console.log('credentials', credentials)
      const response = await axiosClient.post<DeviceResponse>('/devices', { params: credentials })

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
export const updatePositionLatest = createAsyncThunk<void, DeviceUpdateRequest, { rejectValue: string }>(
  'user/login',
  async (data, thunkAPI) => {
    try {
      const response = await axiosClient.post<DeviceResponse>('/updatePosition', { params: data })

      if (!response) {
        return thunkAPI.rejectWithValue('API response is undefined')
      }

      // Dispatch setUser action to update the user state
    } catch (error) {
      console.error(error) // Log the error to see more details
      return thunkAPI.rejectWithValue('Failed to send')
    }
  }
)
