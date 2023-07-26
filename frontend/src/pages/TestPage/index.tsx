import CustomButton from '@components/Button'
import TestComponent from '@components/TestComponent'
import { Box } from '@mui/material'
import { useState } from 'react'

const TestPage: React.FC = () => {
  console.log('Component parent')
  // const [isClick, setIsClick] = useState<boolean>(false)
  const [idRoom, setIdRoom] = useState<number>(1)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [room, setRoom] = useState([
    {
      id: 1,
      name: 'Room1',
      images: [
        { url: 'https://i.pinimg.com/564x/6a/1c/32/6a1c32cdc1dff7a3f5e63abcffd77da1.jpg' },
        { url: 'https://i.pinimg.com/236x/7a/e2/65/7ae26577ad916e13ddf067770a61ac46.jpg' },
        { url: 'https://i.pinimg.com/236x/17/8b/38/178b38968ba2191d25fb8a191387ac3d.jpg' },
        { url: 'https://i.pinimg.com/236x/31/dd/cb/31ddcb99782585970abde78f724e2e24.jpg' },
        { url: 'https://i.pinimg.com/236x/40/ff/aa/40ffaafbe6cbcf6c9884e87a40584066.jpg' }
      ]
    },
    {
      id: 2,
      name: 'Room2',
      images: [
        { url: 'https://i.pinimg.com/236x/02/d1/af/02d1af52505b82f316692ff8b52953c4.jpg' },
        { url: 'https://i.pinimg.com/236x/61/6a/22/616a2285ba489eeba7b6b522c58bf244.jpg' },
        { url: 'https://i.pinimg.com/236x/d2/94/5a/d2945ad3ade7598b9c5064bf292884b6.jpg' },
        { url: 'https://i.pinimg.com/236x/e3/13/45/e3134552425880d7b3fa69586be4200d.jpg' },
        { url: 'https://i.pinimg.com/236x/87/1b/a3/871ba3a0086d23f279e861cb05909226.jpg' }
      ]
    }
  ])
  return (
    <Box height='100%'>
      <CustomButton text='Click me' onClick={() => setIdRoom(1)} />
      <CustomButton text='Click me' onClick={() => setIdRoom(2)} />
      <Box>
        {room
          .filter((item) => item.id === idRoom)
          .map((item) => (
            <TestComponent item={item} key={item.id} />
          ))}
      </Box>
    </Box>
  )
}

export default TestPage
