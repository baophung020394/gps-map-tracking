import { Box } from '@mui/material'
import * as L from 'leaflet'
import React, { useEffect, useState } from 'react'

interface CustomPopoverProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popupInfo: any // Thay bằng kiểu dữ liệu chính xác cho popupInfo
}

const CustomPopover: React.FC<CustomPopoverProps> = ({ popupInfo }) => {
  const [popup, setPopup] = useState<L.Popup | null>(null)

  useEffect(() => {
    if (popupInfo) {
      const latlng: [number, number] = [popupInfo.latlng.lat, popupInfo.latlng.lng]
      const content: string = popupInfo.content

      // Create a new popup
      const newPopup = L.popup({ closeOnClick: false }).setLatLng(latlng).setContent(content)

      // If there is an existing popup, close it before opening the new one
      if (popup) {
        popup.remove()
      }

      // Open the new popup
      newPopup.openOn(popupInfo.map)
      setPopup(newPopup)
    } else {
      // If there is no popupInfo, remove the existing popup
      if (popup) {
        popup.remove()
        setPopup(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupInfo])

  return <Box p={2}>{popupInfo.content}</Box>
}

export default CustomPopover
