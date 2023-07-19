// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  name: string | null
  age: number | null
  isAuthenticated: boolean // Add this line
}

const initialState: UserState = {
  name: null,
  age: null,
  isAuthenticated: false // And this line
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name
      state.age = action.payload.age
      state.isAuthenticated = true // Set isAuthenticated to true when the user is set
    },
    logoutUser: (state) => {
      // Add this reducer to handle logging out
      state.name = null
      state.age = null
      state.isAuthenticated = false
    }
  }
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer
