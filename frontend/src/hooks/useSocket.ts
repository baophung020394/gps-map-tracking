import { useCallback, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import RequestSocket from 'src/models/Common'

export type SocketResponse<T> = {
  ptCommand: number // event
  ptGroup: number // address
  result: string
  status: number
  params: T[]
}

type Data = Record<string, unknown>

interface SocketOptions<T> {
  onOpen: () => void
  onClose: () => void
  onMessage: (message: SocketResponse<T>) => void
}

export const useSocketIO = <T>(socketUrl: string, options: SocketOptions<T>, token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [lastMessage, setLastMessage] = useState<SocketResponse<T> | null>(null)

  const sendSocketMessage = useCallback(
    (event: string, message: RequestSocket<Data>): void => {
      socket?.emit(event, message)
    },
    [socket]
  )

  const disconnectSocket = useCallback((): void => {
    socket?.disconnect()
  }, [socket])

  useEffect(() => {
    const socketIO = io(socketUrl, {
      auth: {
        token: token
      }
    })

    setSocket(socketIO)

    socketIO.on('connect', options.onOpen)

    socketIO.on('disconnect', options.onClose)

    socketIO.on('message', (message: SocketResponse<T>) => {
      console.log('message', message)
      options.onMessage?.(message)
      setLastMessage(message)
    })

    return () => {
      socketIO.disconnect()
    }
  }, [socketUrl, options, token])

  return {
    sendSocketMessage,
    disconnectSocket,
    lastMessage
  }
}
