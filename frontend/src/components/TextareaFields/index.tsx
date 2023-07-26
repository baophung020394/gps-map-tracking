import { TextField, InputAdornment } from '@mui/material'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

interface FormData {
  message: string
}

interface TextareaProps {
  name: keyof FormData
  label?: string
  placeholder?: string
  control: Control<FormData>
  startIcon?: React.ReactNode | string
  endIcon?: React.ReactNode | string
  type?: string
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}

const Textarea: React.FC<TextareaProps> = ({ name, label, control, startIcon, endIcon, placeholder, onKeyDown }) => {
  const renderAdornment = (position: 'start' | 'end') => {
    const icon = position === 'start' ? startIcon : endIcon

    if (icon) {
      return (
        <InputAdornment position={position}>
          {typeof icon === 'string' ? <img src={icon} alt={label} /> : <span>{icon}</span>}
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
          {...field}
          label={label}
          fullWidth
          placeholder={placeholder}
          multiline
          onKeyDown={onKeyDown} // Được thêm vào đây
          InputProps={{
            startAdornment: renderAdornment('start'),
            endAdornment: renderAdornment('end')
          }}
        ></TextField>
      )}
    />
  )
}

export default Textarea
