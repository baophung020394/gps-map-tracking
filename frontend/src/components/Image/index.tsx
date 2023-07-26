import React, { useState, useEffect } from 'react'
import CoverImage from '../../assets/images/channel/chnl-img-default.png'

interface ImageProps {
  src: string
  alt: string
  width?: string
  height?: string
  border?: string
  className?: string
  borderRadius?: string
  boxShadow?: string
}

const LazyImage: React.FC<ImageProps> = ({ src, alt, width, height, border, className, borderRadius, boxShadow }) => {
  const [imageSrc, setImageSrc] = useState(CoverImage)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const image = new Image()
    image.src = src

    image.onload = () => {
      setIsLoading(false)
      setImageSrc(src)
    }

    image.onerror = () => {
      setIsLoading(false)
    }

    return () => {
      // Cleanup when component unmounts
      image.onload = null
      image.onerror = null
    }
  }, [src])

  const handleError = () => {
    setImageSrc(CoverImage)
  }

  const imageStyle: React.CSSProperties = {
    width: width || 'auto',
    height: height || 'auto',
    border: border || 'none',
    borderRadius: borderRadius || '0',
    boxShadow: boxShadow || 'none',
    display: 'block'
  }

  return (
    <div className={className}>
      {isLoading ? (
        <div>Loading...</div> // Hiển thị một thông báo loading trong khi hình ảnh đang được tải
      ) : (
        <img src={imageSrc} alt={alt} onError={handleError} style={imageStyle} />
      )}
    </div>
  )
}

export default LazyImage
