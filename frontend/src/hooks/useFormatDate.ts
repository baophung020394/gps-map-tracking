import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const useFormatDate = (initialDate: string) => {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return format(date, 'HH:mm dd/MM/yyyy')
    }

    setFormattedDate(formatDate(initialDate))
  }, [initialDate])

  return formattedDate
}

export default useFormatDate
