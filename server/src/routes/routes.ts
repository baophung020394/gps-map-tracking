// import { NextFunction, Router, Request, Response } from "express";
// import * as devicesController from "../controllers/devicesController";
// import * as authController from "../controllers/authController";

// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers["authorization"];

//   if (!token) return res.sendStatus(401);

//   // Nếu bạn có một hàm để kiểm tra token thì sử dụng nó ở đây.
//   // Ví dụ:
//   // const isValidToken = verifyToken(token);
//   // if (!isValidToken) return res.sendStatus(403);

//   next(); // nếu token hợp lệ thì tiếp tục xử lý request
// };
// const router = Router();

// // const combinedMiddleware = (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   authenticateToken(req, res, (err?: any) => {
// //     if (err) return next(err);

// //     cacheMiddleware(req, res, (err?: any) => {
// //       if (err) return next(err);

// //       clearCache(req, res, next);
// //     });
// //   });
// // };
// // router.use(authenticateToken, cacheMiddleware, clearCache);
// // router.use(authenticateToken);
// // router.use(cacheMiddleware);
// // router.use(clearCache);

// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.post("/", devicesController.createAddress, authenticateToken);
// router.get("/", devicesController.getAllAddresses);
// router.delete("/delDevice", devicesController.deleteDeviceData);
// router.delete("/delHisttory", devicesController.deleteHistoryData);
// router.delete("/delHisttoryLast", devicesController.deleteHistoryLastData);
// router.get("/:addressId", devicesController.getAddressById);
// router.get("/latest", devicesController.getLatestAddresses);

// export default router;
