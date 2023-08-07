import Register from '@features/Form/register'
import { Box } from '@mui/material'
import { registerUser } from '@stores/actions/register'
import { AppDispatch } from '@stores/index'
// import { setUser } from '@stores/userSlice'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import LoginBackground from 'https://static.vecteezy.com/system/resources/previews/007/164/537/original/fingerprint-identity-sensor-data-protection-system-podium-hologram-blue-light-and-concept-free-vector.jpg'
// import LoginBackground from '../../assets/images/login/bg-login.jpg'
import './register.scss'

interface FormData {
  email: string
  password: string
  passwordConfirm?: string
  username?: string
  role?: string | 'member'
}

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleRegister = async (data: FormData) => {
    console.log('data', data)
    await dispatch(
      registerUser({ email: data?.email, password: data.password, username: data.username, role: 'member' })
    ) // Add this line
    navigate('/login')
  }

  return (
    <Box
      className='login-view'
      style={{
        backgroundImage: `url(${`https://static.vecteezy.com/system/resources/previews/007/164/537/original/fingerprint-identity-sensor-data-protection-system-podium-hologram-blue-light-and-concept-free-vector.jpg`})`
      }}
    >
      <Register onSubmit={handleRegister} />
    </Box>
  )
}

export default RegisterPage
