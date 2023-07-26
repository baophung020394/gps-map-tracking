import { Server } from "socket.io";
import { Socket } from "socket.io";
import {
  AuthCommand,
  AUTH_GROUP,
  DeviceCommand,
  GROUP_DEVICE,
  GROUP_MESSAGE_CHAT,
  GROUP_MESSAGE_LIST,
  MessageCommand,
} from "../constants/message-constant";
import { Device, History, HistoryLast, Latest } from "../models";
import { MessageMessage, SocketMessage } from "../models/channel-model";
const { Op } = require("sequelize");
import jwt from "jsonwebtoken";
import { User } from "../models";
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
    // socket.on("disconnect", () => {
    //   const token = socket.handshake.auth.token as string[];
    //   token.forEach((token) => validTokens.delete(token));
    // });

    socket.on(
      "message",
      (data: SocketMessage, callback: (response: any) => void) => {
        if (!isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)) {
          console.log(
            "Authentication failed for message event.",
            !isSocketAuthenticated(socket, data.ptGroup, data.ptCommand)
          );
          socket.emit("message", "Authentication failed");
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
// Handle the socket message event
const handleSocketMessage = async (
  socket: Socket,
  data: SocketMessage,
  callback?: (response: any) => void
) => {
  console.log("handleSocketMessage");
  const rooms: Record<string, { users: string[]; messages: MessageMessage[] }> =
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
              data: result,
            };

            socket.emit("message", responseDeviceList);
            if (typeof callback === "function") {
              callback(responseDeviceList);
            }
            break;

          case DeviceCommand.DEVICE_LATEST_LIST:
            console.log("Đã nhận ptGroup", data);
            try {
              console.log("data", data);
              const { id, role } = data.data; // Giả định các thông tin user và role được gửi từ client
              console.log("id", id);
              console.log("role", role);
              let devicesLatest: any = [];

              if (role === "member") {
                // Lấy danh sách thiết bị mới nhất dựa vào userId
                devicesLatest = await Latest.findOne({
                  where: { userId: id },
                });
                console.log("member", devicesLatest);
                console.log(" callback", callback);
                if (typeof callback === "function") {
                  return callback({
                    ptCommand: data.ptCommand,
                    ptGroup: data.ptGroup,
                    result: "success",
                    status: 200,
                    count: devicesLatest?.length > 0 ? devicesLatest.length : 0,
                    data: devicesLatest ? [devicesLatest] : [],
                  });
                } else {
                  const responseDeviceLast = {
                    ptCommand: data.ptCommand,
                    ptGroup: data.ptGroup,
                    result: "success",
                    status: 200,
                    count: devicesLatest?.length > 0 ? devicesLatest.length : 0,
                    data: devicesLatest ? [devicesLatest] : [],
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
            if (roomId) {
              if (!rooms[roomId]) {
                rooms[roomId] = { users: [], messages: [] };
              }
              socket.join(roomId);
            }
            break;

          case MessageCommand.JOIN_ROOM:
            if (roomId) {
              socket.join(roomId);
              if (rooms[roomId]) {
                rooms[roomId].users.push(socket.id);
              }
            }
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

          case MessageCommand.FETCH_MESSAGES:
            if (roomId) {
              if (rooms[roomId]) {
                socket.emit("roomMessages", rooms[roomId].messages);
              }
            }
            break;

          default:
            console.log(`Unknown MessageCommand: ${data.ptCommand}`);
            break;
        }
        break;
      case GROUP_MESSAGE_CHAT:
        switch (data.ptCommand) {
          case MessageCommand.SEND_MESSAGE:
            if (roomId) {
              const message: MessageMessage = {
                ptCommand: data.ptCommand,
                ptGroup: data.ptGroup,
                result: data.result,
                message: data.message || "",
                attachment: data.attachment || "",
                messageType: data.messageType || "0",
                chatType: data.chatType,
                txtType: data.txtType,
                ownerId: data.senderId,
                staffMsg: data.staffMsg,
                title: data.title,
                attachment_more: "",
                email_crtfc: "",
                reg_date: data.reg_date,
                regDate: data.regDate,
                senderName: data.senderName,
                senderId: data.senderId,
                message_more: "",
                blinded: "",
                cId: "",
              };

              if (rooms[roomId]) {
                rooms[roomId].messages.push(message);
                io.to(roomId).emit("message", message);
              }
            }
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
