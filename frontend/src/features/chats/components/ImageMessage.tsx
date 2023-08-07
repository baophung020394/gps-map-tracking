import Image from '@components/Image'
import { Box } from '@mui/material'
import { memo } from 'react'

export interface SingleImage {
  end_date: string
  mode: string
  result: string
  org_file: string
  thumb_width: string
  thumb_height: string
  enc: string
  type: string
  dir: string
  save_file: string
  file_size: string
  thumb_file: string
}

interface MultiImage {
  type: 'multi'
  count: number
  contents: SingleImage[]
  chatId: string
}

export type Attachment = SingleImage | MultiImage

interface ImageMessageProps {
  attachment: Attachment
}
interface Image {
  save_file: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

function calculateImageRows(images: Image[]): Image[][] {
  const maxImagesPerRow = 3
  const totalImages = images.length
  const totalRows = Math.ceil(totalImages / maxImagesPerRow)

  const imageRows: Image[][] = []

  let imageIndex = 0

  for (let i = 0; i < totalRows; i++) {
    const imagesInRow = []

    const imagesRemaining = totalImages - imageIndex
    let imagesInThisRow

    if (i === 0) {
      // First row
      imagesInThisRow = imagesRemaining % maxImagesPerRow || maxImagesPerRow
    } else {
      // Other rows
      imagesInThisRow = imagesRemaining >= maxImagesPerRow ? maxImagesPerRow : 2
    }

    for (let j = 0; j < imagesInThisRow; j++) {
      imagesInRow.push(images[imageIndex])
      imageIndex++
    }

    imageRows.push(imagesInRow)
  }

  return imageRows
}

function isMultiImage(attachment: Attachment): attachment is MultiImage {
  return 'count' in attachment && 'contents' in attachment
}

const ImageMessage: React.FC<ImageMessageProps> = ({ attachment }) => {
  if (isMultiImage(attachment)) {
    // Now TypeScript knows that attachment is of type MultiImage
    const imageRows = calculateImageRows(attachment.contents)

    return (
      <Box className='multiple-image'>
        {imageRows.map((row, rowIndex) => (
          <div key={rowIndex} className={`image-${row.length} image-row`}>
            {row.map((img, index) => (
              <Image
                key={index}
                src={`https://moeme-file-dev.aveapp.com/file/api/down_proc.jsp?type=1&serverfile=${img.save_file}`}
                alt='Chat'
                width='244px'
                isLazy={true}
              />
              //   <img key={index} src={img.save_file} alt='Chat' style={{ width: 244, marginRight: 8 }} />
            ))}
          </div>
        ))}
      </Box>
    )
  } else {
    // TypeScript knows that attachment is of type SingleImage here
    return (
      <Box className='single-image'>
        <Image
          src={`https://moeme-file-dev.aveapp.com/file/api/down_proc.jsp?type=1&serverfile=${attachment.save_file}`}
          alt='Chat'
          width='100%'
          isLazy={true}
        />
      </Box>
    )
  }
}

export default memo(ImageMessage)
