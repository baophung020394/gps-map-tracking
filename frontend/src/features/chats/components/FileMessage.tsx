import Image from '@components/Image'
import { Box, Typography } from '@mui/material'
import React from 'react'
import WordIcon from '../../../assets/images/chat/Word-52-icon.svg'
import PDFIcon from '../../../assets/images/chat/PDF-52-icon.svg'
import PowerPointIcon from '../../../assets/images/chat/Poweroint-52-icon.svg'
import ExcelIcon from '../../../assets/images/chat/Excel-52-icon.svg'
import FileIcon from '../../../assets/images/chat/File-52-icon.svg'
import DownloadIcon from '../../../assets/images/chat/Download-icon.svg'
import useFileSizeConverter from '@hooks/useFileSizeConverter'

export type AttachmentFile = {
  end_date: string
  mode: string
  result: string
  org_file: string
  enc: string
  type: string
  dir: string
  save_file: string
  file_size: string
}

interface FileMessageProps {
  attachment: AttachmentFile
}

const FileMessage: React.FC<FileMessageProps> = ({ attachment }) => {
  const { org_file, file_size, save_file } = attachment
  const fileName = org_file.split('/').pop() || ''
  const convertedSize = useFileSizeConverter(Number(file_size))

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'docx':
        return WordIcon
      case 'xlsx':
        return ExcelIcon
      case 'pdf':
        return PDFIcon
      case 'pptx':
        return PowerPointIcon
      default:
        return FileIcon
    }
  }

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'docx':
        return 'DOCX'
      case 'xlsx':
        return 'XLSX'
      case 'pdf':
        return 'PDF'
      case 'pptx':
        return 'PPTX'
      default:
        return 'Other'
    }
  }

  const fileIcon = getFileIcon(fileName)
  const fileType = getFileType(fileName)

  return (
    <Box className='file-message'>
      <Box className='file-message__file'>
        <Box className='file-message__file__left'>
          <Image src={fileIcon} alt='File Icon' className='file-icon' />
          <Box className='infor-file'>
            <Typography variant='h3' component='h3'>
              {fileName}
            </Typography>
            <Typography component='p'>
              {fileType} - {convertedSize}
            </Typography>
          </Box>
        </Box>
        <Box className='file-message__file__right'>
          <a
            rel='noreferrer'
            download
            target='_blank'
            href={`https://moeme-file-dev.aveapp.com/file/api/down_proc.jsp?type=1&serverfile=${save_file}`}
          >
            <Image src={DownloadIcon} alt='download-file' />
          </a>
        </Box>
      </Box>
    </Box>
  )
}

export default FileMessage
