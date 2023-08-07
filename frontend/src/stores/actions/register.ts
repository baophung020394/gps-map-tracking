// actions/login.ts
import axiosClient from '@apis/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginResponse } from 'src/models/User'

interface RegisterUser {
  email: string | ''
  password: string | ''
  username?: string | null
  role: string | 'member'
}

export const registerUser = createAsyncThunk<void, RegisterUser, { rejectValue: string }>(
  'user/register',
  async (credentials, thunkAPI) => {
    try {
      console.log('credentials', credentials)
      if (credentials.email) {
        const response = await axiosClient.post<LoginResponse>('/register', { data: credentials })
        console.log('response', response)
        if (!response || !response.data.params) {
          return thunkAPI.rejectWithValue('API response is undefined')
        }
      }
    } catch (error) {
      console.error(error) // Log the error to see more details
      return thunkAPI.rejectWithValue('Failed to register')
    }
  }
)
