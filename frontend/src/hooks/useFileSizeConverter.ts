import { useEffect, useState } from 'react'

const useFileSizeConverter = (fileSize: number) => {
  const [convertedSize, setConvertedSize] = useState('')

  useEffect(() => {
    const convertFileSize = (size: number) => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB']
      let convertedSize = size
      let unitIndex = 0

      while (convertedSize >= 1024 && unitIndex < units.length - 1) {
        convertedSize /= 1024
        unitIndex++
      }

      return `${convertedSize.toFixed(2)} ${units[unitIndex]}`
    }

    const converted = convertFileSize(fileSize)
    setConvertedSize(converted)
  }, [fileSize])

  return convertedSize
}

export default useFileSizeConverter
