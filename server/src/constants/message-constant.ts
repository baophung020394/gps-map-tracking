export const GROUP_DEVICE = 12345;
export const GROUP_MESSAGE_LIST = 22345;
export const GROUP_MESSAGE_CHAT = 32345;
export const AUTH_GROUP = 44567;

export enum AuthCommand {
  AUTH_COMMAND_LOGIN = 44568,
  AUTH_COMMAND_LOGOUT = 44569,
}

export enum DeviceCommand {
  DEVICE_LIST = 12346,
  DEVICE_LATEST_LIST = 12347,
  DEVICE_LIST_LAST = 12348,
  ADD_DEVICE = 12349,
  EDIT_DEVICE = 12350,
  DELETE_DEVICE = 12351,
  // Add more commands here if needed
}

export enum MessageCommand {
  CREATE_ROOM = 22346,
  JOIN_ROOM = 22347,
  LEAVE_ROOM = 22348,
  SEND_MESSAGE = 22349,
  FETCH_ROOMS = 22350,
  CHECK_USER_ROOM = 22351,
}
