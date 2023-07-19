import React from 'react'
import { useForm } from 'react-hook-form'

interface FormInputs {
  example: string
  exampleRequired: string
}

interface FormHookProps {
  onLogin: () => void
}

const FormHook: React.FC<FormHookProps> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>()
  const onSubmit = (data: FormInputs) => {
    console.log(data)
    onLogin()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('example')} defaultValue='test' />
      <input {...register('exampleRequired', { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}
      <input type='submit' />
    </form>
  )
}

export default FormHook
