import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserParams } from 'src/models/User'

const initialState: UserParams = {
  userId: '',
  atk: '',
  email: '',
  role: '',
  isAuthenticated: localStorage.getItem('token') === 'true'
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserParams>) => {
      console.log(state)
      return { ...action.payload, isAuthenticated: true } // Spread the payload and set isAuthenticated to true
      // return { ...action.payload, isAuthenticated: true } // Spread the payload and set isAuthenticated to true
    },
    logoutUser: (state) => {
      console.log(state)
      // Reset state to initial state on logout
      return initialState
    }
  }
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer
