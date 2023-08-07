import { Request, Response } from "express";
import { Device, Latest, History, HistoryLast, User } from "../models";
import { getSocketServer } from "../socket/index";
import { Op } from "sequelize";
import { DeviceCommand, GROUP_DEVICE } from "../constants/message-constant";

export const createDevice = async (req: Request, res: Response) => {
  try {
    const { name, userId, address, date, latitude, longitude } =
      req.body.params;
    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Kiểm tra xem người dùng có vai trò 'member' và đã tạo thiết bị chưa
    if (user.role === "member") {
      const existingDeviceForUser = await Device.findOne({ where: { userId } });
      if (existingDeviceForUser) {
        return res.status(400).json({
          error: "User with role 'member' can only create one device.",
        });
      }
    }

    // 2. Tạo một thiết bị mới.
    const device = await Device.create({ name, userId: userId });
    const deviceId = device.getDataValue("deviceId");

    // 3. Chuyển đổi date từ chuỗi "YYYY-MM-DD" sang kiểu Date và tạo bản ghi History.
    const convertedDate = new Date(date);
    await History.create({
      deviceName: name,
      address,
      latitude,
      longitude,
      deviceId: Number(deviceId),
      date: convertedDate,
    });

    // 4. Giới hạn số dòng trong bảng HistoryLast là 30 dòng gần nhất và tạo mới.
    const latestThirtyDays = await HistoryLast.findAll({
      order: [["date", "DESC"]],
      limit: 29,
    });

    const idsToDelete = await HistoryLast.findAll({
      attributes: ["id"],
      where: {
        id: {
          [Op.notIn]: latestThirtyDays.map((history) => history.id),
        },
      },
    });

    await HistoryLast.destroy({
      where: {
        id: {
          [Op.in]: idsToDelete.map((history) => history.id),
        },
      },
    });

    await HistoryLast.create({
      deviceName: name,
      address,
      latitude,
      longitude,
      deviceId: Number(deviceId),
      date: convertedDate,
    });

    // 5. Cập nhật hoặc tạo mới trong bảng Latest.
    const existingLatestData = await Latest.findOne({
      where: { deviceId: Number(deviceId) },
    });
    if (existingLatestData) {
      await Latest.update(
        {
          deviceName: name,
          address,
          latitude,
          longitude,
          date: convertedDate,
        },
        {
          where: {
            deviceId: Number(deviceId),
          },
        }
      );
    } else {
      await Latest.create({
        deviceId: Number(deviceId),
        deviceName: name,
        address,
        latitude,
        longitude,
        userId,
        date: convertedDate,
      });
    }

    // 6. Lấy và gửi danh sách thiết bị mới nhất qua socket.
    const deviceList = await getLatestDeviceList();
    getSocketServer().emit("message", {
      ptCommand: DeviceCommand.DEVICE_LATEST_LIST,
      ptGroup: GROUP_DEVICE,
      result: "success",
      status: 200,
      data: deviceList,
    });

    return res.status(201).json({ device });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllAddressByDeviceId = async (req: Request, res: Response) => {
  try {
    // Giả định rằng userId và role đã được lưu vào req sau khi đi qua middleware xác thực
    const { userId, role, deviceId } = req.body;

    console.log("req.body", req.body);
    let devices = [];
    if (role === "member") {
      devices = await Device.findAll({ where: { userId: userId } });
    } else if (role === "admin" || role === "super") {
      devices = await Device.findAll({ where: { deviceId: deviceId } });
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Dùng Promise.all để lấy thông tin từ bảng History cho mỗi device
    const devicesWithHistory = await Promise.all(
      devices.map(async (device) => {
        const history = await History.findAll({
          where: { deviceId: device.deviceId },
        });
        return {
          device: device,
          history: history,
        };
      })
    );

    // Format dữ liệu trả về theo mong muốn
    const formattedDevices = devicesWithHistory.map((item) => {
      return {
        id: item.device.deviceId,
        // Thêm các trường thông tin khác của thiết bị (device) tùy ý
        // Ví dụ: deviceName, address, latitude, longitude, ...
        // Sau đó, thêm bảng history vào dưới dạng mảng (history)
        history: item.history,
      };
    });

    return res.status(200).json({ devices: formattedDevices });
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};

export const updatePositionLatest = async (req: Request, res: Response) => {
  try {
    const { address, latitude, longitude, date, name, userId, deviceId } =
      req.body.params;

    // Add data to History table
    await History.create({
      address,
      latitude,
      longitude,
      date,
      name,
      userId,
      deviceId,
    });

    // Update data in HistoryLast table
    await HistoryLast.update(
      { address, latitude, longitude, date, name, userId },
      { where: { deviceId } }
    );

    // Update data in Latest table (or create if not exists)
    const existingLatest = await Latest.findOne({ where: { deviceId } });

    if (existingLatest) {
      // Nếu đã tồn tại bản ghi có deviceId như vậy, bạn cập nhật dữ liệu mới nhất
      await Latest.update(
        {
          address,
          latitude,
          longitude,
          date,
          name,
          userId,
        },
        { where: { deviceId } }
      );
    } else {
      // Nếu chưa có bản ghi nào có deviceId như vậy, bạn thêm mới
      await Latest.create({
        address,
        latitude,
        longitude,
        date,
        name,
        userId,
        deviceId,
      });
    }

    // Retrieve lat and long data for the given deviceId
    const latLongList = await Latest.findAll({
      attributes: ["latitude", "longitude","address","date"],
      where: { deviceId },
    });

    getSocketServer().emit("message", {
      ptCommand: DeviceCommand.DEVICE_LATEST_LIST,
      ptGroup: GROUP_DEVICE,
      result: "success",
      status: 200,
      params: latLongList,
    });

    return res.status(200).json({ message: "Update success", latLongList });
  } catch (error) {
    console.error("Error updating position:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getAllDevices = async (req: Request, res: Response) => {
  try {
    let devices = [];
    // Giả định rằng userId và role đã được lưu vào req sau khi đi qua middleware xác thực
    const { userId, role } = req.body;

    if (role === "member") {
      devices = await Device.findAll({ where: { userId: userId } });
    } else if (role === "admin" || role === "super") {
      devices = await Device.findAll();
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    return res.status(200).json({ devices });
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};

export const getLatestDevices = async (req: Request, res: Response) => {
  try {
    let devices = [];
    // Giả định rằng userId và role đã được lưu vào req sau khi đi qua middleware xác thực
    const { userId, role } = req.body;

    if (role === "member") {
      // Nếu là member, lấy danh sách thiết bị mới nhất liên quan đến userId
      devices = await Latest.findAll({ where: { deviceId: userId } });
    } else if (role === "admin" || role === "super") {
      // Nếu là admin hoặc super, lấy toàn bộ danh sách thiết bị mới nhất
      devices = await Latest.findAll();
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    return res.status(200).json({ devices });
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};

// Hàm trợ giúp lấy danh sách thiết bị mới nhất.
const getLatestDeviceList = async () => {
  const latestDevices = await Latest.findAll({
    attributes: ["deviceId"],
  });

  return await Device.findAll({
    where: {
      deviceId: {
        [Op.in]: latestDevices.map((device) => device.deviceId),
      },
    },
    include: [
      {
        model: Latest,
        attributes: ["date", "address", "latitude", "longitude"],
      },
    ],
    order: [[Latest, "date", "DESC"]],
  });
};

// export const getLatestDevices = async (req: Request, res: Response) => {
//   try {
//     const latestDevices = await HistoryLast.findAll({
//       order: [["date", "DESC"]],
//       attributes: [
//         "deviceId",
//         "deviceName",
//         "address",
//         "latitude",
//         "longitude",
//       ],
//       group: ["deviceId"],
//     });

//     return res.status(200).json({ devices: latestDevices });
//   } catch (error: any) {
//     return res.status(500).send(error.message);
//   }
// };

// export const getAllDevices = async (req: Request, res: Response) => {
//   try {
//     const devices = await Device.findAll();
//     return res.status(200).json({ devices });
//   } catch (error: any) {
//     return res.status(500).send(error.message);
//   }
// };

export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findByPk(deviceId);
    if (device) {
      return res.status(200).json({ device });
    }
    return res.status(404).send("Device with the specified ID does not exist");
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};

export const deleteDeviceData = async (req: Request, res: Response) => {
  try {
    await Device.destroy({ where: {} });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("error:", error);
    res.status(500).send({ message: "error" });
  }
};

export const deleteHistoryData = async (req: Request, res: Response) => {
  try {
    await History.destroy({ where: {} });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("error:", error);
    res.status(500).send({ message: "error." });
  }
};

export const deleteHistoryLastData = async (req: Request, res: Response) => {
  try {
    await HistoryLast.destroy({ where: {} });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("error", error);
    res.status(500).send({ message: " error" });
  }
};
export const deleteLatestData = async (req: Request, res: Response) => {
  try {
    await Latest.destroy({ where: {} });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("error", error);
    res.status(500).send({ message: " error" });
  }
};
