import { Box } from '@mui/material'
import React, { memo } from 'react'
import EmojiIcon from '../../assets/images/messenger/emoji-icon.svg'
import AttachIcon from '../../assets/images/messenger/attach-icon.svg'
import SendIcon from '../../assets/images/messenger/send-icon.svg'
import CustomButton from '@components/Button'
// import Image from '@components/Image'
import Textarea from '@components/TextareaFields'
import { useForm } from 'react-hook-form'
import { UserParams } from 'src/models/User'
import { MessageContent } from 'src/models/ChatsModel'

// interface MessengerProps {
//   // Các props của bạn
// }
interface FormData {
  message: string
}

interface MessengerProps {
  onSubmit?: (data: MessageContent) => void
  userInfo: UserParams | null
}

const Messenger: React.FC<MessengerProps> = ({ userInfo, onSubmit }) => {
  const { handleSubmit, control, setValue, getValues } = useForm<FormData>()

  const onSubmitForm = (data: FormData) => {
    if (onSubmit) {
      // Giả sử bạn đã lấy được các thông tin cần thiết
      const messageContent = {
        attachment: '', // attachment
        type: '0', // type
        userName: userInfo?.username, // userName
        content: data.message,
        userId: userInfo?.id // userId
      }
      onSubmit(messageContent)
      setValue('message', '') // Reset giá trị của textarea sau khi gửi
    }
  }

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Ngăn chặn hành vi mặc định của Enter
      if (event.shiftKey) {
        // Nếu nhấn Shift + Enter thì thêm một dòng mới vào giá trị của 'message'
        const newValue = `${getValues().message}\n`
        setValue('message', newValue)
      } else {
        // Nếu chỉ nhấn Enter thì gửi form
        handleSubmit(onSubmitForm)()
      }
    }
  }

  return (
    <Box className='chat-room__messenger'>
      <Box className='messenger'>
        <CustomButton
          text=''
          width={28}
          height={28}
          backgroundColor='unset'
          backgroundColorHover='unset'
          backgroundImage={EmojiIcon}
          className='messenger--icon emoj'
        />
        <CustomButton
          text=''
          width={28}
          height={28}
          backgroundColor='unset'
          backgroundColorHover='unset'
          backgroundImage={AttachIcon}
          className='messenger--icon attachment'
        />
        {/* <Input name='userId' placeholder='User ID' control={control} type='text' startIcon={UserIcon} /> */}
        <form onSubmit={handleSubmit(onSubmitForm)} className='messenger--textarea'>
          <Textarea name='message' placeholder='Aa' control={control} type='text' onKeyDown={handleTextareaKeyDown} />
        </form>
        <CustomButton
          text=''
          width={28}
          height={28}
          backgroundColor='unset'
          backgroundColorHover='unset'
          backgroundImage={SendIcon}
          className='messenger--icon send'
        />
      </Box>
    </Box>
  )
}

export default memo(Messenger)
