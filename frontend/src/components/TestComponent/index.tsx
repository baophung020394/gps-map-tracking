import Image from '@components/Image'
import { Box } from '@mui/material'
import { memo } from 'react'

interface TestComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
}
const TestComponent: React.FC<TestComponentProps> = ({ item }) => {
  console.log('Component child')
  return (
    <Box display='flex' height='100%'>
      <Box>Component child</Box>
      <p>{item.name}</p>

      {item.images.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (img: any, idx: number) => (
          <Image src={img.url} alt='' key={idx} width='240px' />
        )
      )}
    </Box>
  )
}

export default memo(TestComponent)
