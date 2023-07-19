require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import addressRoutes from "./routes/address";
import * as redis from "redis";
import { promisify } from "util";
import * as addressesController from "./controllers/addressesController";
import { createServer } from "http";
import { initSocketServer } from "./socket";
import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

// Khởi tạo Redis client
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;

// Khởi tạo Redis client

const app = express();
// const server = new Server(app);
app.use(cors());
app.use(bodyParser.json());

// Khởi tạo socket
const httpServer = createServer(app);
initSocketServer(httpServer);

const redisClient = redis.createClient({
  legacyMode: true,
});

redisClient.connect();

// Promisify Redis client functions
const getAsync = promisify(redisClient.get).bind(redisClient);
const setexAsync = promisify(redisClient.setEx).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Middleware để cache dữ liệu từ Redis
const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { addressId } = req.params;

  try {
    // Kiểm tra xem dữ liệu đã được lưu trong Redis chưa
    const data = await getAsync(addressId);

    if (data !== null) {
      // Dữ liệu đã tồn tại trong Redis
      const address = JSON.parse(data);
      return res.status(200).json({ address });
    }

    // Dữ liệu chưa tồn tại trong Redis, chuyển tiếp tới middleware tiếp theo
    next();
  } catch (error: unknown) {
    console.error(error as Error);
    return res.status(500).send((error as Error).message);
  }
};

// Đăng ký middleware cache cho route lấy thông tin địa chỉ bằng ID
app.get(
  "/api/addresses/:addressId",
  cacheMiddleware,
  addressesController.getAddressById
);

// Khi tạo hoặc cập nhật địa chỉ, hãy xóa bỏ dữ liệu cache tương ứng trong Redis
const clearCache = async (req: Request, res: Response, next: NextFunction) => {
  const { addressId } = req.params;

  try {
    await delAsync(addressId);

    // Chuyển tiếp tới middleware tiếp theo
    next();
  } catch (error: unknown) {
    console.error(error as Error);
    return res.status(500).send((error as Error).message);
  }
};

// Đăng ký middleware xóa cache cho các route tạo và cập nhật địa chỉ
app.post("/api/addresses", addressesController.createAddress, clearCache);
// Đăng ký middleware xóa cache cho route lấy danh sách địa chỉ
app.get("/api/addresses", addressesController.getAllAddresses, clearCache);

const port = process.env.PORT || 5005;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

redisClient.on("ready", () => {
  console.log("Client Redis đã kết nối");
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
