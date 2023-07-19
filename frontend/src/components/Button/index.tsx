import React from 'react'
import { Button, styled } from '@mui/material'

// A type definition for the props of the custom button component
type CustomButtonProps = {
  icon?: string // The source of the optional icon
  text?: string // The text of the button
  border?: string // The text of the button
  boxShadow?: string // The text of the button
  borderHover?: string // The text of the button
  width?: string | number // The width of the button
  minWidth?: string | number // The width of the button
  maxWidth?: string | number // The width of the button
  height?: string | number // The height of the button
  minHeight?: string | number // The height of the button
  maxHeight?: string | number // The height of the button
  borderRadius?: string | number // The height of the button
  textColor?: string // The color of the text
  textColorHover?: string // The color of the text hover
  backgroundColor?: string // The color of the background
  backgroundImage?: string // The source of the optional background image
  backgroundColorHover?: string // The color of the background hover
}
const CONST_PROP_NAME = [
  'boxShadow',
  'borderHover',
  'textColorHover',
  'backgroundColorHover',
  'backgroundColor',
  'textColor',
  'backgroundImage',
  'borderRadius',
  'maxWidth',
  'maxHeight',
  'minWidth',
  'minHeight'
]
// A styled component that defines the appearance and behavior of the button based on the props
const StyledButton = styled(Button, {
  shouldForwardProp: (propName: string) => !CONST_PROP_NAME.includes(propName)
})<CustomButtonProps>(
  ({
    border,
    theme,
    width,
    height,
    boxShadow,
    textColor,
    textColorHover,
    borderHover,
    backgroundColor,
    backgroundImage,
    backgroundColorHover,
    borderRadius,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight
  }) => ({
    width: width || 'auto',
    height: height || 'auto',
    maxWidth: maxWidth || 'auto',
    maxHeight: maxHeight || 'auto',
    minWidth: minWidth || 'auto',
    minHeight: minHeight || 'auto',
    color: textColor || 'white',
    border: border || 'transparent',
    backgroundColor: backgroundColor || theme.palette.primary.main,
    backgroundImage: backgroundImage && `url(${backgroundImage})`,
    boxShadow: boxShadow || 'unset',
    borderRadius: borderRadius || 0,
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: boxShadow,
      backgroundColor: backgroundColorHover,
      color: textColorHover,
      border: borderHover
    },
    '&:active': {
      transform: 'scale(0.95)',
      boxShadow: theme.shadows[1]
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  })
)

// A component that renders the button with an optional icon and text
const CustomButton = ({ icon, text, ...rest }: CustomButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <StyledButton {...rest} variant='contained' color='primary' startIcon={icon && <img src={icon} alt='' />}>
      {text}
    </StyledButton>
  )
}

export default CustomButton
