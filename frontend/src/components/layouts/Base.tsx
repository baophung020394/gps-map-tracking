import { Box } from '@mui/material'
import { FC } from 'react'
import Navbar from './Common/Navbar'

interface BaseLayoutProps {
  children?: React.ReactNode
}

export const withBaseLayout = (Component: FC<BaseLayoutProps>) => {
  const BaseLayout: FC<BaseLayoutProps> = (props) => (
    <Box className='main-container' height='100%' width='100%' display='flex'>
      <Navbar />
      <Component {...props} />
    </Box>
  )

  // Thêm tên hiển thị cho component BaseLayout
  BaseLayout.displayName = `withBaseLayout(${Component.displayName || Component.name})`

  return BaseLayout
}
