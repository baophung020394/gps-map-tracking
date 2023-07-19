import { Request, Response } from "express";
import { Device, History, HistoryLast } from "../models";
import { getSocketServer } from "../socket";
import { Op } from "sequelize";

export const createAddress = async (req: Request, res: Response) => {
  try {
    const { name, address, date, latitude, longitude } = req.body.params;
    console.log("req.body.params", req.body.params);
    // Insert into Device table
    const device = await Device.create({ name });
    const deviceId = device.getDataValue("deviceId");
    // Chuyển đổi date từ chuỗi "YYYY-MM-DD" sang kiểu ngày tháng (Date)
    const convertedDate = new Date(date);
    // Insert into History table
    await History.create({
      deviceName: name,
      address,
      latitude,
      longitude,
      deviceId: Number(deviceId),
      date: convertedDate,
    });

    // Giới hạn số dòng trong bảng HistoryLast là 30 dòng gần nhất
    const latestThirtyDays = await HistoryLast.findAll({
      order: [["date", "DESC"]],
      limit: 30,
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
    // Insert into HistoryLast table
    await HistoryLast.create({
      deviceName: name,
      address,
      latitude,
      longitude,
      deviceId: Number(deviceId),
      date: convertedDate,
    });

    // Emit socket event after successfully creating address
    const addresses = await Device.findAll({
      include: [
        {
          model: History,
          attributes: ["latitude", "longitude"],
        },
      ],
    });

    if (addresses) {
      getSocketServer().emit("message", {
        ptCommand: 12345,
        ptGroup: 12346,
        result: "success",
        status: 200,
        data: addresses,
      });
    }

    return res.status(201).json({ device });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Device.findAll();
    return res.status(200).json({ addresses });
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const address = await Device.findByPk(addressId);
    if (address) {
      return res.status(200).json({ address });
    }
    return res.status(404).send("Address with the specified ID does not exist");
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};
