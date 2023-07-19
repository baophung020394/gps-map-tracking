import { Server } from "socket.io";
import { Socket } from "socket.io";
import { Device, History, HistoryLast } from "../models";
const { Op } = require("sequelize");

let io: Server;

interface Address {
  ptCommand: number;
  ptGroup: number;
  result: string;
  status: number;
  data: any[] | object;
}

interface Chat {
  ptCommand: number;
  ptGroup: number;
  result: string;
  status: number;
  message: string;
  attachment: string;
  messageType: string;
  chatType: string;
}

export const initSocketServer = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client ${socket.id} connected`);

    // Handle 'message' event
    socket.on("message", async (data, callback) => {
      console.log(`Received message event with data: ${JSON.stringify(data)}`);
      let result: any = undefined;
      let type = undefined;
      // Do something based on ptCommand
      switch (data.ptGroup) {
        case 12346: // If this is an 'addressList' message...
          // Handle 'addressList' here
          console.log("Đã nhận ptGroup", data);
          const addresses = await Device.findAll({
            include: [
              {
                model: History,
                attributes: ["address", "latitude", "longitude"],
              },
            ],
          });
          result = addresses;
          type = "array";
          break;

        case 12347: // If this is an 'addressList' message...
          try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const addressesLast = await Device.findAll({
              include: [
                {
                  model: HistoryLast,
                  attributes: ["address", "latitude", "longitude"],
                  where: {
                    date: {
                      [Op.gte]: thirtyDaysAgo, // Lọc dữ liệu trong vòng 30 ngày gần nhất
                    },
                  },
                  required: true, // Chỉ lấy các bản ghi từ bảng Device mà có ít nhất một bản ghi từ bảng HistoryLast trong vòng 30 ngày gần nhất
                },
              ],
            });

            result = addressesLast;
            type = "array";
          } catch (error) {
            console.error("Error:", error);
          }

          break;

        case 22345: // If this is a 'chat' message...
          // Handle 'chat' here
          console.log("data chat", data);
          type = "object";
          break;

        default:
          console.log(`Unknown ptCommand: ${data.ptCommand}`);
      }

      // Then, send a response back to the client
      const response = {
        ptCommand: data.ptCommand,
        ptGroup: data.ptGroup,
        result: "success",
        status: 200,
        count: type === "array" ? result?.length : undefined,
        data: result, // Replace with actual data
      };

      socket.emit("message", response);

      if (typeof callback === "function") {
        callback(response);
      }
    });
  });
};

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io server is not initialized");
  }

  return io;
};
