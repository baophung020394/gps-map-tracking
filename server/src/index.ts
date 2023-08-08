require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as redis from "redis";
import { promisify } from "util";
import * as devicesController from "./controllers/devicesController";
import * as authController from "./controllers/authController";
import { createServer } from "http";
import { initSocketServer } from "./socket/index";
import jwt from "jsonwebtoken";

// Khởi tạo Redis client
const app = express();
// Cấu hình CORS chỉ cho phép yêu cầu từ địa chỉ IP cụ thể
const allowedOrigins = ['http://192.168.64.11:5006'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(bodyParser.json());

// Khởi tạo socket
const httpServer = createServer(app);
initSocketServer(httpServer);

const redisClient = redis.createClient({
  legacyMode: true,
});

redisClient.connect();

// Promisify Redis client functions
export const getAsync = promisify(redisClient.get).bind(redisClient);
export const setexAsync = promisify(redisClient.setEx).bind(redisClient);
export const delAsync = promisify(redisClient.del).bind(redisClient);
export const router = express.Router();

const expiredTokens: { [token: string]: number } = {};
const JWT_SECRET = process.env.JWT_SECRET || "keysecret";

// Middleware xác thực token từ Redis
// export const authenticateToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers["authorization"];

//   if (!token) return res.sendStatus(401);

//   try {
//     const sessionExists = await getAsync(token);
//     console.log("sessionExists", sessionExists);
//     if (sessionExists) {
//       next();
//     } else {
//       res.sendStatus(403);
//     }
//   } catch (error: unknown) {
//     console.error(error as Error);
//     return res.sendStatus(403);
//   }
// };

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  // Kiểm tra xem token có trong danh sách token hết hạn chưa
  const expirationTime = expiredTokens[token];
  if (expirationTime && Date.now() < expirationTime) {
    // Token hết hạn, từ chối truy cập
    return res.sendStatus(403);
  }

  try {
    // Kiểm tra token bằng cách giải mã nó
    jwt.verify(token, JWT_SECRET);
    // Token hợp lệ, cho phép truy cập
    next();
  } catch (error: unknown) {
    console.error(error as Error);
    // Token không hợp lệ, từ chối truy cập và đánh dấu nó là token hết hạn
    expiredTokens[token] = Date.now() + 30 * 1000; // Thêm 30 giây vào thời gian hiện tại
    return res.sendStatus(403);
  }
};

// Middleware để cache dữ liệu từ Redis
export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { deviceId } = req.params;

  try {
    // Kiểm tra xem dữ liệu đã được lưu trong Redis chưa
    const data = await getAsync(deviceId);

    if (data !== null) {
      // Dữ liệu đã tồn tại trong Redis
      const device = JSON.parse(data);
      return res.status(200).json({ device });
    }

    // Dữ liệu chưa tồn tại trong Redis, chuyển tiếp tới middleware tiếp theo
    next();
  } catch (error: unknown) {
    console.error(error as Error);
    return res.status(500).send((error as Error).message);
  }
};

// Khi tạo hoặc cập nhật địa chỉ, hãy xóa bỏ dữ liệu cache tương ứng trong Redis
export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { deviceId } = req.params;

  try {
    await delAsync(deviceId);

    // Chuyển tiếp tới middleware tiếp theo
    next();
  } catch (error: unknown) {
    console.error(error as Error);
    return res.status(500).send((error as Error).message);
  }
};

// app.use(authenticateToken, cacheMiddleware, clearCache);
// app.use(authenticateToken);
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/devices", authenticateToken, devicesController.createDevice);
app.get("/api/devices", authenticateToken, devicesController.getAllDevices);
app.post(
  "/api/updatePosition",
  authenticateToken,
  devicesController.updatePositionLatest
);
app.post(
  "/api/devices/:addressId",
  authenticateToken,
  devicesController.getAllAddressByDeviceId
);

app.delete(
  "/api/delDevice",
  authenticateToken,
  devicesController.deleteDeviceData
);
app.delete(
  "/api/delHisttory",
  authenticateToken,
  devicesController.deleteHistoryData
);
app.delete(
  "/api/delHisttoryLast",
  authenticateToken,
  devicesController.deleteHistoryLastData
);
app.delete(
  "/api/delLatest",
  authenticateToken,
  devicesController.deleteLatestData
);
app.get("/api/latest", authenticateToken, devicesController.getLatestDevices);

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
