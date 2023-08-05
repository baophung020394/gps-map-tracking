import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { AuthCommand, AUTH_GROUP } from "../constants/message-constant";
import { User } from "../models";

const JWT_SECRET = process.env.JWT_SECRET || "keysecret";

export const handleSocketLogin = async (socket: Socket, data: any) => {
  try {
    const { email, password } = data.data;
    // Xử lý logic đăng nhập từ controllers/authController.ts
    // Lưu ý rằng không có `res` trong Socket.IO, nên bạn cần xử lý việc trả về kết quả bằng socket.emit
    // Ví dụ: kiểm tra thông tin đăng nhập, tạo token và gửi về client

    const user = await User.findOne({ where: { email } });
    if (!user || !user.comparePassword(password)) {
      socket.emit("message", {
        ptGroup: AUTH_GROUP,
        ptCommand: AuthCommand.AUTH_COMMAND_LOGIN,
        result: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lưu token vào Redis hoặc nơi lưu trữ tùy chọn
    // await setexAsync(token, 3600, "authorization_redis");

    // Gửi token về client
    socket.emit("message", {
      ptGroup: AUTH_GROUP,
      ptCommand: AuthCommand.AUTH_COMMAND_LOGIN,
      result: "success",
      status: 200,
      data: { token },
    });
  } catch (error: any) {
    socket.emit("message", {
      ptGroup: AUTH_GROUP,
      ptCommand: AuthCommand.AUTH_COMMAND_LOGIN,
      result: "error",
      status: 500,
      error: error.message,
    });
  }
};
