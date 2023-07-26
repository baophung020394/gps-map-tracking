// actions/login.ts
import axiosClient from '@apis/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setUser } from '@stores/userSlice'
import { LoginResponse } from 'src/models/User'

interface LoginUser {
  email: string
  password: string
}

export const loginUser = createAsyncThunk<void, LoginUser, { rejectValue: string }>(
  'user/login',
  async (credentials, thunkAPI) => {
    try {
      console.log('credentials', credentials)
      const response = await axiosClient.post<LoginResponse>('/login', { data: credentials })
      console.log('response', response)
      if (!response || !response.data.params) {
        return thunkAPI.rejectWithValue('API response is undefined')
      }

      // if (!response || response.data.result !== 'success') {
      //   return thunkAPI.rejectWithValue('Username or password wrong!')
      // }

      // Save token in localStorage after successful login
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.params))

      // Dispatch setUser action to update the user state
      thunkAPI.dispatch(setUser(response.data.params)) // Pass the entire params as payload
    } catch (error) {
      console.error(error) // Log the error to see more details
      return thunkAPI.rejectWithValue('Failed to log in')
    }
  }
)
