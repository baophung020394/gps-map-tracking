// import { Socket } from "socket.io";
// import { DeviceCommand, GROUP_DEVICE } from "../constants/message-constant";
// import { getAllDevices } from "../controllers/devicesController";

// export const handleSocketDeviceList = async (socket: Socket, data: any) => {
//   try {
//     // Xử lý logic lấy danh sách thiết bị từ controllers/devicesController.ts
//     // Lưu ý rằng không có `res` trong Socket.IO, nên bạn cần xử lý việc trả về kết quả bằng socket.emit
//     const devices = await getAllDevices(data.body); // Thay bằng xử lý lấy danh sách thiết bị từ database

//     socket.emit("message", {
//       ptGroup: GROUP_DEVICE,
//       ptCommand: DeviceCommand.DEVICE_LIST,
//       result: "success",
//       status: 200,
//       data: devices,
//     });
//   } catch (error: any) {
//     socket.emit("message", {
//       ptGroup: GROUP_DEVICE,
//       ptCommand: DeviceCommand.DEVICE_LIST,
//       result: "error",
//       status: 500,
//       error: error.message,
//     });
//   }
// };

// // Tương tự, bạn có thể xử lý các hàm xử lý khác trong devicesController tại đây.
