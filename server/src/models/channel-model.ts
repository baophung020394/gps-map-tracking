import {
  AuthCommand,
  AUTH_GROUP,
  DeviceCommand,
  GROUP_DEVICE,
  GROUP_MESSAGE_CHAT,
  GROUP_MESSAGE_LIST,
} from "../constants/message-constant";

export type ChatType = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export type MessageTypeValue = "0" | "2" | "3" | "50" | string | number;

export interface UserParams {
  id: string;
  atk: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
  deviceId?: string;
}

export interface DeviceLatestListMessage {
  ptCommand: DeviceCommand.DEVICE_LATEST_LIST;
  ptGroup: typeof GROUP_DEVICE;
  roomId?: string;
  data: UserParams;
}

export interface DeviceListMessage {
  ptCommand: DeviceCommand.DEVICE_LIST;
  ptGroup: typeof GROUP_DEVICE;
  roomId?: string;
}
export interface DeviceListLastMessage {
  ptCommand: DeviceCommand.DEVICE_LIST_LAST;
  ptGroup: typeof GROUP_DEVICE;
}

export interface AddDeviceMessage {
  ptCommand: DeviceCommand.ADD_DEVICE;
  ptGroup: typeof GROUP_DEVICE;
  roomId?: string;
  // Add more properties specific to this message type if needed
}

export interface EditDeviceMessage {
  ptCommand: DeviceCommand.EDIT_DEVICE;
  ptGroup: typeof GROUP_DEVICE;
  roomId?: string;
  // Add more properties specific to this message type if needed
}

export interface DeleteDeviceMessage {
  ptCommand: DeviceCommand.DELETE_DEVICE;
  ptGroup: typeof GROUP_DEVICE;
  roomId?: string;
  // Add more properties specific to this message type if needed
}

export interface AuthLoginMessage {
  ptCommand: AuthCommand.AUTH_COMMAND_LOGIN;
  ptGroup: typeof AUTH_GROUP;
  roomId?: string;
  data: {
    email: string;
    password: string;
    // Add other fields if needed
  };
}
export interface AuthLogoutMessage {
  ptCommand: AuthCommand.AUTH_COMMAND_LOGOUT;
  ptGroup: typeof AUTH_GROUP;
  roomId?: string;
}

export interface MessageMessage {
  ptCommand: any; // You can define the type for this as needed
  ptGroup: typeof GROUP_MESSAGE_CHAT;
  roomId?: string;
  chatId?: string;
  txtType?: string;
  ownerId?: string;
  staffMsg?: string;
  title?: string;
  message?: string;
  attachment_more?: string;
  email_crtfc?: string;
  reg_date: string;
  regDate: string;
  senderName?: string;
  senderId?: string;
  messageType?: MessageTypeValue;
  attachment?: string;
  message_more?: string;
  blinded?: string;
  cId?: string;
  chatType?: ChatType | number;
  dateMarker?: string;
  result?: string;
}

export interface MessageListMessage {
  ptCommand: any; // You can define the type for this as needed
  ptGroup: typeof GROUP_MESSAGE_LIST;
  roomId?: string;
  count?: number;
  result?: string;
  params?: MessageMessage[] | Record<string, unknown>;
}

export type SocketMessage =
  | AuthLoginMessage
  | AuthLogoutMessage
  | DeviceListMessage
  | DeviceLatestListMessage
  | DeviceListLastMessage
  | AddDeviceMessage
  | EditDeviceMessage
  | DeleteDeviceMessage
  | MessageListMessage
  | MessageMessage;
