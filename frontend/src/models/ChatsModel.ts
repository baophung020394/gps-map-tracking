export type ChatType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'

export type MessageTypeValue = '0' | '2' | '3' | '50' | string | number

export interface MessageModel {
  roomId?: string
  chatId?: string
  txtType?: string
  ownerId?: string
  staffMsg?: string
  title?: string
  message?: string
  attachment_more?: string
  email_crtfc?: string
  reg_date: string
  regDate: string
  senderName?: string
  senderId?: string
  messageType?: MessageTypeValue
  attachment?: string
  message_more?: string
  blinded?: string
  cId?: string
  chatType?: ChatType | number
  dateMarker?: string
  [Symbol.iterator](): Iterator<MessageModel>
}

export interface LastMessage {
  count?: number
  ptCommand: number
  ptGroup: number
  result: string
  ptDevice: string
  params?: MessageModel[] | Record<string, unknown>
}

export interface MessageContent {
  attachment: string
  type: string
  userName: string | undefined
  content: string
  userId: string | undefined
}

export interface SocketResponseMessage<T> {
  ptCommand: number // event
  ptGroup: number // address
  result: string
  status: number
  roomId: string
  data: T[]
}

export interface RoomModel {
  userId?: string
  roomId: string
  roomName: string
  roomProfileImage?: string
  roomDescription?: string
  inRoom?: boolean
}

interface ChatsListResponse<T> {
  count?: number
  ptCommand: number
  ptGroup: number
  result: string
  ptDevice: string
  roomId?: string
  params: T[]
}

export default ChatsListResponse
