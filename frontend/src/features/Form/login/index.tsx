import CustomButton from '@components/Button'
import Image from '@components/Image'
import InputFieldLoginForm from '@components/InputFieldLoginForm'
import { VisibilityOff } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import FacebookIcon from '../../../assets/images/login/facebook.svg'
import GoogleIcon from '../../../assets/images/login/google.svg'
import LockIcon from '../../../assets/images/login/Lock-bold-icon.svg'
import Logo from '../../../assets/images/login/Logo.png'
import UserIcon from '../../../assets/images/login/User-bold-icon.svg'
import './login-form.scss'

interface FormData {
  email: string | ''
  password: string | ''
}

interface LoginProps {
  onSubmit: (data: FormData) => void
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const { handleSubmit, control } = useForm<FormData>()

  const onClickSubmit = (data: FormData) => {
    console.log(data)
    if (!onSubmit) return
    onSubmit(data)
  }

  return (
    <Box className='login--box'>
      <form onSubmit={handleSubmit(onClickSubmit)} className='login--box__form'>
        <Typography variant='h1' component='h1'>
          <Image src={Logo} alt='logo' width='183px' height='68px' />
        </Typography>
        <Typography variant='h3' component='h3'>
          Sign in
        </Typography>

        <div className='form--inputs'>
          <div className='form--inputs__input userid'>
            <InputFieldLoginForm name='email' placeholder='Email' control={control} type='text' startIcon={UserIcon} />
          </div>
          <div className='form--inputs__input password'>
            <InputFieldLoginForm
              name='password'
              placeholder='User Password'
              control={control}
              type='password'
              startIcon={LockIcon}
              endIcon={<VisibilityOff />}
            />
          </div>
        </div>

        <div className='btn-options'>
          <CustomButton text='Sign in' type='submit' className='btn-login'></CustomButton>
        </div>
      </form>

      <div className='line'>
        <span>OR</span>
      </div>

      <div className='socials'>
        <button>
          <span>
            <Image src={FacebookIcon} alt='fb-icon' />
          </span>
          Continue with Facebook
        </button>
        <button>
          <span>
            <Image src={GoogleIcon} alt='fb-icon' />
          </span>
          Continue with Google
        </button>
      </div>
    </Box>
  )
}

export default Login
