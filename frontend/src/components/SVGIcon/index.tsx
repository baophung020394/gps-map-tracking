import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import MarkerIcon from '@mui/icons-material/Room'

interface MarkerSvgIconProps extends SvgIconProps {
  color?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

const MarkerSvgIcon: React.FC<MarkerSvgIconProps> = ({ color = 'primary', ...props }) => {
  return (
    <SvgIcon {...props}>
      <MarkerIcon htmlColor={color} />
    </SvgIcon>
  )
}

export default MarkerSvgIcon
