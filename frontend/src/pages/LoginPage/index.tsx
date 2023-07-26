import LoginForm from '@features/Form/login'
import { Box } from '@mui/material'
import { loginUser } from '@stores/actions/login'
import { AppDispatch } from '@stores/index'
// import { setUser } from '@stores/userSlice'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoginBackground from '../../assets/images/login/bg-login.jpg'
import './login.scss'

interface FormData {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogin = async (data: FormData) => {
    console.log('data', data)
    await dispatch(loginUser({ email: data?.email, password: data.password })) // Add this line
    navigate('/maps')
  }

  return (
    <Box
      className='login-view'
      style={{
        backgroundImage: `url(${LoginBackground})`
      }}
    >
      <LoginForm onSubmit={handleLogin} />
    </Box>
  )
}

export default LoginPage
