import { TextField, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'

interface FormData {
  name: string
  address: string
  latitude: number
  longitude: number
  userId: string
  date: Date
}

interface InputProps {
  name: keyof FormData
  label?: string
  className?: string
  placeholder?: string
  control: Control<FormData>
  type?: 'text' | 'password' | 'date'
  startIcon?: React.ReactNode | string
  endIcon?: React.ReactNode | string
}

const Input: React.FC<InputProps> = ({ name, label, control, type, startIcon, endIcon, placeholder, className }) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible)
  }

  const renderAdornment = (position: 'start' | 'end') => {
    const icon = position === 'start' ? startIcon : endIcon

    if (icon) {
      return (
        <InputAdornment position={position}>
          {typeof icon === 'string' ? (
            <img src={icon} alt={label} />
          ) : (
            <IconButton
              onClick={position === 'end' && type === 'password' ? togglePasswordVisibility : undefined}
              edge={position}
              tabIndex={-1}
            >
              {position === 'end' && type === 'password' ? passwordVisible ? <Visibility /> : <VisibilityOff /> : icon}
            </IconButton>
          )}
        </InputAdornment>
      )
    }

    return null
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=''
      render={({ field }) => (
        <TextField
          className={className}
          {...field}
          label={label}
          fullWidth
          placeholder={placeholder}
          type={type}
          InputProps={{
            startAdornment: renderAdornment('start'),
            endAdornment: renderAdornment('end')
          }}
        />
      )}
    />
  )
}

export default Input
