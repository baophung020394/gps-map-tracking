import { Server } from "socket.io";
import { Socket } from "socket.io";
import { format } from "date-fns";
import {
  AuthCommand,
  AUTH_GROUP,
  DeviceCommand,
  GROUP_DEVICE,
  GROUP_MESSAGE_CHAT,
  GROUP_MESSAGE_LIST,
  MessageCommand,
} from "../constants/message-constant";
import {
  Device,
  History,
  HistoryLast,
  Latest,
  Message,
  UserRoom,
} from "../models";
import {
  MessageModel,
  MessageRoomModel,
  MessageRoomResponse,
  SocketMessage,
} from "../models/channel-model";
const { Op } = require("sequelize");
import jwt from "jsonwebtoken";
import { User, Room } from "../models";
let io: Server;
const validTokens = new Set<string>();
const JWT_SECRET = process.env.JWT_SECRET || "keysecret";

interface UserType {
  id: number;
  username: string;
  email: string;
}

const isSocketAuthenticated = (
  socket: Socket,
  ptGroup: number,
  ptCommand: number
): boolean => {
  // Bỏ qua xác thực cho login và logout
  if (
    ptGroup === AUTH_GROUP &&
    (ptCommand === AuthCommand.AUTH_COMMAND_LOGIN ||
      ptCommand === AuthCommand.AUTH_COMMAND_LOGOUT)
  ) {
    return true;
  }

  const token = socket.handshake.auth.token;
  console.log("tokenserver", token);
  if (!token) {
    console.log("token null", token);
    return false;
  }

  try {
    const verifytoken = jwt.verify(token, JWT_SECRET);
    console.log("verifytoken", verifytoken);
    return true;
  } catch (error) {
    return false;
  }
};

export const initSocketServer = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client ${socket.id} connected`);
    console.log("Handshake auth data:", socket.handshake.auth);

    socket.on(
      "message",
      (data: SocketMessage, callback: (response: any) => void) => {
        if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
          console.log(
            "Authentication failed for message event.",
            !isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)
          );
          socket.emit("message", {
            ptCommand: 55555,
            ptGroup: 55554,
            result: "Unauthorized",
          });
          return;
        }
        handleSocketMessage(socket, data, callback);
      }
    );
  });
};

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io server is not initialized");
  }
  return io;
};

/**
 * Handle join room
 * @param socket
 * @param data
 * @returns
 */
const handleJoinRoom = async (socket: Socket, data: SocketMessage) => {
  // Kiểm tra và xác thực token của client
  if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
    socket.emit("message", {
      ptCommand: 55555,
      ptGroup: 55554,
      result: "Unauthorized",
    });
    return;
  }

  try {
    if ("params" in data && data.params instanceof Object) {
      const params = data.params as MessageRoomModel;
      const { roomId, userId } = params;

      // Kiểm tra xem roomId có tồn tại trong cơ sở dữ liệu hay không
      const room = await Room.findOne({ where: { id: roomId } });
      if (!room) {
        socket.emit("message", {
          ptCommand: MessageCommand.JOIN_ROOM,
          ptGroup: GROUP_MESSAGE_LIST,
          result: "error",
          error: "Room does not exist.",
        });
        return;
      }

      // Kiểm tra xem userId đã tham gia phòng (room) hay chưa
      const userRoom = await UserRoom.findOne({ where: { userId, roomId } });
      if (userRoom) {
        socket.emit("message", {
          ptCommand: MessageCommand.JOIN_ROOM,
          ptGroup: GROUP_MESSAGE_LIST,
          result: "error",
          error: "You are already in this room.",
        });
        return;
      }

      console.log("join socket");

      // Tiến hành join vào phòng bằng socket.io
      socket.join(roomId);

      // Lấy danh sách users hiện tại của phòng từ cơ sở dữ liệu
      const currentUsers = room.users || [];

      // Thêm userId vào danh sách users của phòng
      const updatedUsers = [...currentUsers, userId];

      // Cập nhật danh sách users mới vào cơ sở dữ liệu
      await room.update({ users: updatedUsers });

      // Thêm userId vào bảng UserRoom
      await UserRoom.create({ userId, roomId });

      // Kiểm tra xem userId đã có tin nhắn trong phòng hay chưa
      const userInfor = await User.findOne({
        where: {
          id: userId,
        },
      });

      const existingMessage = await Message.findOne({
        where: {
          roomId: roomId,
          userId: userId,
        },
      });

      if (!existingMessage) {
        // Nếu chưa có tin nhắn, thêm tin nhắn mới vào bảng Message
        const newMessage = await Message.create({
          userId: userId,
          roomId: roomId,
          senderId: userId,
          senderName: userInfor?.dataValues.username,
          content: "",
          messageType: "50",
          chatType: "50",
        });

        // Gửi thông báo thành công cho client
        getSocketServer().to(roomId).emit("message", {
          ptCommand: MessageCommand.JOIN_ROOM,
          ptGroup: GROUP_MESSAGE_LIST,
          result: "success",
          params: newMessage,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    socket.emit("message", {
      ptCommand: MessageCommand.JOIN_ROOM,
      ptGroup: GROUP_MESSAGE_LIST,
      result: "error",
      error: "Error while joining the room.",
    });
  }
};

/**
 * Create Room
 * @param socket
 * @param data
 * @param callback
 * @returns
 */
const handleCreateRoom = async (
  socket: Socket,
  data: SocketMessage,
  callback?: (response: any) => void
) => {
  // Kiểm tra và xác thực token của client
  if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
    socket.emit("message", {
      ptCommand: 55555,
      ptGroup: 55554,
      result: "Unauthorized",
    });
    return;
  }

  try {
    // Lưu thông tin phòng vào cơ sở dữ liệu
    if ("params" in data && data.params instanceof Object) {
      const params = data.params as MessageRoomModel;
      const { userId, roomId, roomName, roomDescription, roomProfileImage } =
        params;
      // Kiểm tra xem tên phòng có tồn tại trong cơ sở dữ liệu hay không
      const existingRoom = await Room.findOne({
        where: {
          roomName: roomName,
        },
      });

      if (existingRoom) {
        socket.emit("message", {
          ptCommand: MessageCommand.CREATE_ROOM,
          ptGroup: GROUP_MESSAGE_LIST,
          result: "error",
          error: "Room with this name already exists.",
        });
        return;
      }

      // Tạo phòng mới trong cơ sở dữ liệu
      const newRoom = await Room.create({
        roomName: roomName,
        roomType: "group", // Chọn loại phòng (group, channel, chat_1_1) tùy thuộc vào yêu cầu của bạn
        roomProfileImage: roomProfileImage || null,
        roomDescription: roomDescription,
        userId: userId,
      });
      // Lấy roomId mới tạo từ kết quả của create và gán vào biến newRoomId
      const newRoomId = newRoom.getDataValue("id");

      // Thêm người dùng chủ phòng vào bảng UserRoom
      const ownerId = userId; // Lấy userId từ dữ liệu gửi từ client
      await UserRoom.create({
        userId: ownerId,
        roomId: newRoomId,
      });

      // Gửi thông báo tạo phòng thành công cho client
      const responseCreateRoom = {
        ptCommand: MessageCommand.CREATE_ROOM, // Trả về lại ptCommand của yêu cầu tạo phòng
        ptGroup: GROUP_MESSAGE_LIST, // Trả về lại ptGroup của yêu cầu tạo phòng
        result: "success",
        params: {
          roomName: roomName,
          roomId: newRoomId,
          roomDescription,
          roomProfileImage,
          userId: ownerId,
        }, // Mã phòng đã tạo thành công
      };

      socket.emit("message", responseCreateRoom);

      // (Tùy chọn) Nếu bạn muốn thêm phòng vào danh sách phòng và lưu trữ thông tin phòng
      // để sử dụng sau này, bạn có thể thêm code ở đây để lưu thông tin phòng vào biến hoặc cơ sở dữ liệu.
      // Ví dụ:
      // rooms[roomId] = { users: [], messages: [] };
      // rooms[roomId].roomName = room_name;
      // rooms[roomId].roomProfileImage = room_profile_image;
    }
  } catch (error) {
    console.error("Error:", error);
    socket.emit("message", {
      ptCommand: MessageCommand.CREATE_ROOM,
      ptGroup: GROUP_MESSAGE_LIST,
      result: "error",
      error: "Error while creating the room.",
    });
  }
};

/**
 * Handle join room
 * @param socket
 * @param data
 * @returns
 */
const handleFetchRooms = async (socket: Socket, data: SocketMessage) => {
  // Kiểm tra và xác thực token của client
  if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
    socket.emit("message", {
      ptCommand: 55555,
      ptGroup: 55554,
      result: "Unauthorized",
    });
    return;
  }

  try {
    if ("params" in data && data.params instanceof Object) {
      const rooms = await Room.findAll();

      // Tạo một mảng mới chứa thông tin về từng phòng để gửi về cho client
      const roomList = rooms.map((room) => ({
        roomId: room.id,
        roomName: room.roomName,
        roomType: room.roomType,
        roomProfileImage: room.roomProfileImage,
        roomDescription: room.roomDescription,
        users: room.users || [], // Danh sách users trong phòng (nếu có)
      }));

      // Nếu userId được cung cấp, lấy danh sách phòng mà người dùng đó tham gia
      // if (userId) {
      //   const userRooms = await UserRoom.findAll({ where: { userId } });
      //   const userRoomIds = userRooms.map((userRoom) =>
      //     userRoom.roomId.toString()
      //   );
      //   const userRoomsData = roomList.filter((room) =>
      //     userRoomIds.includes(room.roomId)
      //   );
      //   // Gửi danh sách phòng mà người dùng tham gia về cho client
      //   socket.emit("message", {
      //     ptCommand: MessageCommand.FETCH_ROOMS,
      //     ptGroup: GROUP_MESSAGE_LIST,
      //     result: "success",
      //     params: userRoomsData,
      //   });
      // } else {
      //   // Ngược lại, gửi toàn bộ danh sách phòng về cho client
      //   socket.emit("message", {
      //     ptCommand: MessageCommand.FETCH_ROOMS,
      //     ptGroup: GROUP_MESSAGE_LIST,
      //     result: "success",
      //     params: roomList,
      //   });
      // }
      socket.emit("message", {
        ptCommand: MessageCommand.FETCH_ROOMS,
        ptGroup: GROUP_MESSAGE_LIST,
        result: "success",
        params: roomList,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    socket.emit("message", {
      ptCommand: MessageCommand.JOIN_ROOM,
      ptGroup: GROUP_MESSAGE_LIST,
      result: "error",
      error: "Error while joining the room.",
    });
  }
};

/**
 * Handle check user in room
 * @param socket
 * @param data
 * @returns
 */
const handleCheckUserInRoom = async (socket: Socket, data: SocketMessage) => {
  // Kiểm tra và xác thực token của client
  if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
    socket.emit("message", {
      ptCommand: 55555,
      ptGroup: 55554,
      result: "Unauthorized",
    });
    return;
  }

  try {
    if ("params" in data && data.params instanceof Object) {
      const params = data.params as { userId: string; roomId: string };
      const { userId, roomId } = params;

      // Tìm kiếm bản ghi trong bảng UserRoom dựa vào userId và roomId
      const userRoom = await UserRoom.findOne({
        where: { userId, roomId },
      });

      const room = await Room.findOne({
        where: { id: roomId },
      });

      // Nếu tồn tại bản ghi, tức là người dùng đã có trong phòng
      if (userRoom) {
        socket.emit("message", {
          ptCommand: MessageCommand.CHECK_USER_ROOM,
          ptGroup: GROUP_MESSAGE_LIST,
          result: "success",
          params: {
            inRoom: true,
            roomName: room?.roomName,
            roomDescription: room?.roomDescription,
            roomType: room?.roomType,
            roomProfileImage: room?.roomProfileImage,
            roomId: room?.id,
          },
        });
      } else {
        socket.emit("message", {
          ptCommand: MessageCommand.CHECK_USER_ROOM,
          ptGroup: GROUP_MESSAGE_LIST,
          result: "success",
          params: {
            inRoom: false,
            roomName: room?.roomName,
            roomDescription: room?.roomDescription,
            roomType: room?.roomType,
            roomProfileImage: room?.roomProfileImage,
            roomId: room?.id,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    socket.emit("message", {
      ptCommand: MessageCommand.CHECK_USER_ROOM,
      ptGroup: GROUP_MESSAGE_LIST,
      result: "error",
      error: "Error while checking user in room.",
    });
  }
};

const handleSendMessage = async (socket: Socket, data: SocketMessage) => {
  // Kiểm tra và xác thực token của client
  if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
    socket.emit("message", {
      ptCommand: 55555,
      ptGroup: 55554,
      result: "Unauthorized",
    });
    return;
  }
  try {
    if ("params" in data) {
      const params = data.params as MessageModel;
      const { senderId, message, roomId, senderName, messageType, chatType } =
        params;

      // Lưu tin nhắn vào cơ sở dữ liệu (ví dụ: RoomMessage là model cho bảng chứa tin nhắn)
      if (roomId) {
        const currentDate = format(new Date(), "dd/MM/yyyy HH:mm:ss");
        const newMessage = await Message.create({
          userId: senderId,
          senderId,
          senderName,
          roomId: roomId,
          content: message,
          messageType,
          chatType,
          attachment: "",
          date: currentDate,
        });

        // Gửi tin nhắn đã lưu về cho tất cả các client trong phòng (bao gồm cả client gửi tin nhắn)
        getSocketServer().to(roomId).emit("message", {
          ptCommand: MessageCommand.SEND_MESSAGE_ALL_TO_ROOM, // Trả về lại ptCommand của yêu cầu gửi tin nhắn
          ptGroup: GROUP_MESSAGE_CHAT, // Trả về lại ptGroup của yêu cầu gửi tin nhắn
          result: "success",
          params: newMessage.dataValues, // Tin nhắn đã lưu vào cơ sở dữ liệu
        });
      } else {
        socket.emit("message", {
          ptCommand: MessageCommand.SEND_MESSAGE_ALL_TO_ROOM,
          ptGroup: GROUP_MESSAGE_CHAT,
          result: "error",
          error: "RoomId not found",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    socket.emit("message", {
      ptCommand: MessageCommand.SEND_MESSAGE_ALL_TO_ROOM,
      ptGroup: GROUP_MESSAGE_CHAT,
      result: "error",
      error: "Error while checking user in room.",
    });
  }
};

/**
 * Handle fetch messages for a specific user and room
 * @param socket
 * @param data
 * @returns
 */
const handleFetchMessage = async (socket: Socket, data: SocketMessage) => {
  // Kiểm tra và xác thực token của client
  if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
    socket.emit("message", {
      ptCommand: 55555,
      ptGroup: 55554,
      result: "Unauthorized",
    });
    return;
  }

  try {
    if ("params" in data && data.params instanceof Object) {
      const params = data.params as { userId: string; roomId: string };
      const { userId, roomId } = params;

      // Tìm kiếm bản ghi trong bảng UserRoom dựa vào userId và roomId
      const userRoom = await UserRoom.findOne({
        where: { userId, roomId },
      });

      // Nếu không tồn tại bản ghi, tức là người dùng chưa tham gia phòng này
      if (!userRoom) {
        socket.emit("message", {
          ptCommand: MessageCommand.FETCH_MESSAGES,
          ptGroup: GROUP_MESSAGE_CHAT,
          result: "error",
          error: "User is not a member of this room.",
        });
        return;
      }

      // Tiến hành join vào phòng bằng socket.io
      socket.join(roomId);

      // Lấy danh sách tin nhắn của người dùng trong phòng từ bảng Message
      // const messages = await Message.findAll({
      //   where: {
      //     roomId: roomId,
      //     userId: userId,
      //   },
      // });
      const messages = await Message.findAll({
        where: { roomId: roomId },
      });
      // Gửi danh sách tin nhắn về cho client
      socket.emit("message", {
        ptCommand: MessageCommand.FETCH_MESSAGES,
        ptGroup: GROUP_MESSAGE_CHAT,
        result: "success",
        params: messages,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    socket.emit("message", {
      ptCommand: MessageCommand.FETCH_MESSAGES,
      ptGroup: GROUP_MESSAGE_CHAT,
      result: "error",
      error: "Error while fetching messages for the user and room.",
    });
  }
};

// Handle the socket message event
const handleSocketMessage = async (
  socket: Socket,
  data: SocketMessage,
  callback?: (response: any) => void
) => {
  console.log("handleSocketMessage");
  const rooms: Record<string, { users: string[]; messages: MessageModel[] }> =
    {};
  const token = socket.handshake.auth.token as string;
  if (!validTokens.has(token)) {
    console.log("token null");
    if (typeof callback === "function") {
      return callback({ error: "Unauthorized" });
    }
  }
  let result: any;
  let type: string | undefined;

  try {
    switch (data.ptGroup) {
      case GROUP_DEVICE:
        switch (data.ptCommand) {
          case DeviceCommand.DEVICE_LIST:
            console.log("Đã nhận ptGroup", data);
            const devices = await Device.findAll({
              include: [
                {
                  model: History,
                  attributes: ["date", "address", "latitude", "longitude"],
                  // as: "addresses",
                },
              ],
              order: [[History, "date", "DESC"]],
            });
            result = devices;
            type = "array";
            const responseDeviceList = {
              ptCommand: data.ptCommand,
              ptGroup: data.ptGroup,
              result: "success",
              status: 200,
              count: type === "array" ? result?.length : undefined,
              params: result,
            };

            socket.emit("message", responseDeviceList);
            if (typeof callback === "function") {
              callback(responseDeviceList);
            }

            break;

          case DeviceCommand.DEVICE_LATEST_LIST:
            console.log("Đã nhận ptGroup", data);
            try {
              // console.log("data", data);
              const { id, role } = data.params; // Giả định các thông tin user và role được gửi từ client
              // console.log("id", id);
              // console.log("role", role);
              let devicesLatest: any = [];

              if (role === "member") {
                // Lấy danh sách thiết bị mới nhất dựa vào userId
                devicesLatest = await Latest.findOne({
                  where: { userId: id },
                });

                if (typeof callback === "function") {
                  return callback({
                    ptCommand: data.ptCommand,
                    ptGroup: data.ptGroup,
                    result: "success",
                    status: 200,
                    count: devicesLatest?.length > 0 ? devicesLatest.length : 0,
                    params: devicesLatest ? [devicesLatest] : [],
                  });
                } else {
                  const responseDeviceLast = {
                    ptCommand: data.ptCommand,
                    ptGroup: data.ptGroup,
                    result: "success",
                    status: 200,
                    count: devicesLatest?.length > 0 ? devicesLatest.length : 0,
                    params: devicesLatest ? [devicesLatest] : [],
                  };
                  socket.emit("message", responseDeviceLast);
                }
              } else if (role === "admin" || role === "super") {
                // Lấy danh sách thiết bị mới nhất cho admin hoặc super
                devicesLatest = await Latest.findAll();
                const responseDeviceLast = {
                  ptCommand: data.ptCommand,
                  ptGroup: data.ptGroup,
                  result: "success",
                  status: 200,
                  count: devicesLatest?.length > 0 ? devicesLatest.length : 0,
                  data: devicesLatest,
                };
                socket.emit("message", responseDeviceLast);
              } else {
                // Unauthorized access
                if (typeof callback === "function") {
                  return callback({
                    ptCommand: data.ptCommand,
                    ptGroup: data.ptGroup,
                    result: "error",
                    status: 403,
                    error: "Unauthorized access",
                  });
                } else {
                  const responseError = {
                    ptCommand: data.ptCommand,
                    ptGroup: data.ptGroup,
                    result: "error",
                    status: 403,
                    error: "Unauthorized access",
                  };
                  socket.emit("message", responseError);
                }
              }

              // Gửi danh sách thiết bị mới nhất về cho client
            } catch (error: any) {
              if (typeof callback === "function") {
                return callback({
                  ptCommand: data.ptCommand,
                  ptGroup: data.ptGroup,
                  result: "error",
                  status: 500,
                  error: error.message,
                });
              } else {
                const responseError = {
                  ptCommand: data.ptCommand,
                  ptGroup: data.ptGroup,
                  result: "error",
                  status: 500,
                  error: error.message,
                };
                socket.emit("message", responseError);
              }
            }
            //

            break;

          case DeviceCommand.DEVICE_LIST_LAST:
            // Handle get address last list
            try {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

              const addressesLast = await Device.findAll({
                include: [
                  {
                    model: HistoryLast,
                    attributes: ["date", "address", "latitude", "longitude"],
                    // as: "addresses",
                    where: {
                      date: {
                        [Op.gte]: thirtyDaysAgo,
                      },
                    },
                    required: true,
                  },
                ],
                order: [[HistoryLast, "date", "DESC"]],
              });

              result = addressesLast;
              type = "array";
              const responseDeviceLastList = {
                ptCommand: data.ptCommand,
                ptGroup: data.ptGroup,
                result: "success",
                status: 200,
                count: type === "array" ? result?.length : undefined,
                data: result,
              };

              socket.emit("message", responseDeviceLastList);
              if (typeof callback === "function") {
                callback(responseDeviceLastList);
              }
            } catch (error) {
              console.error("Error:", error);
            }

            break;

          case DeviceCommand.EDIT_DEVICE:
            // Handle 'editChannel' here
            // ...
            break;

          case DeviceCommand.DELETE_DEVICE:
            // Handle 'deleteChannel' here
            // ...
            break;

          default:
            console.log(
              `Unknown ptCommand: ${(data as SocketMessage).ptCommand}`
            );
            break;
        }
        break;
      case GROUP_MESSAGE_LIST:
        const roomId = data.roomId;
        switch (data.ptCommand) {
          case MessageCommand.CREATE_ROOM:
            handleCreateRoom(socket, data, callback);
            break;

          case MessageCommand.JOIN_ROOM:
            handleJoinRoom(socket, data);
            break;

          case MessageCommand.LEAVE_ROOM:
            if (roomId) {
              socket.leave(roomId);
              if (rooms[roomId]) {
                const index = rooms[roomId].users.indexOf(socket.id);
                if (index > -1) {
                  rooms[roomId].users.splice(index, 1);
                }
              }
            }

            break;

          case MessageCommand.FETCH_ROOMS:
            handleFetchRooms(socket, data);
            break;
          case MessageCommand.CHECK_USER_ROOM:
            handleCheckUserInRoom(socket, data);
            break;

          default:
            console.log(`Unknown MessageCommand: ${data.ptCommand}`);
            break;
        }
        break;
      case GROUP_MESSAGE_CHAT:
        switch (data.ptCommand) {
          case MessageCommand.SEND_MESSAGE:
            handleSendMessage(socket, data);
            break;
          case MessageCommand.FETCH_MESSAGES:
            handleFetchMessage(socket, data);
            break;

          default:
            console.log(`Unknown MessageCommand: ${data.ptCommand}`);
            break;
        }
        break;

      case AUTH_GROUP:
        switch (data.ptCommand) {
          case AuthCommand.AUTH_COMMAND_LOGIN:
            console.log("data.credentials", data);
            const { email, password } = data.data; // Giả sử data bạn gửi lên có thông tin email và password
            const user = await User.findOne({ where: { email } });
            if (!user || !user.comparePassword(password)) {
              socket.emit("error", "Invalid credentials.");
              if (typeof callback === "function") {
                callback({ error: "Invalid credentials." });
              }
              return;
            }

            const tokenlogin = jwt.sign({ userId: user.id }, JWT_SECRET, {
              expiresIn: "1h",
            });

            validTokens.add(tokenlogin);

            const responseUserInfor = {
              ptCommand: data.ptCommand,
              ptGroup: data.ptGroup,
              result: "success",
              status: 200,
              data: { tokenlogin, userId: user.id, email: user.email },
            };
            socket.emit("message", responseUserInfor);
            if (typeof callback === "function") {
              callback(responseUserInfor);
            }
            break;

          case AuthCommand.AUTH_COMMAND_LOGOUT:
            const token = socket.handshake.auth.token;
            if (token) {
              validTokens.delete(token);
              console.log(`Token removed and client ${socket.id} logged out.`);
              socket.disconnect(true);
            }
            break;

          default:
            console.log(
              `Unknown MessageCommand: ${(data as SocketMessage).ptCommand}`
            );
            break;
        }
        break;

      default:
        console.log(`Unknown ptCommand: ${(data as SocketMessage).ptCommand}`);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
    if (typeof callback === "function") {
      callback({ error: "Internal server error" });
    }
  }
};
