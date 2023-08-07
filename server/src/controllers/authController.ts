// src/controllers/authController.ts
import { Request, Response } from "express";
import { User } from "../models";
import jwt from "jsonwebtoken";
import { setexAsync } from "..";

const JWT_SECRET = process.env.JWT_SECRET || "keysecret";

export const register = async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body);
    const { username, email, password, role } = req.body.data;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = await User.create({ username, email, password, role });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const cloneData = { ...user.dataValues };
    cloneData.atk = token;
    return res.status(201).json({
      ptGroup: 44567,
      ptCommand: 44569,
      token: token,
      params: cloneData,
      result: "success",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body.data;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lưu token vào Redis với một thời gian tồn tại là 3600 giây (1 giờ).
    await setexAsync(token, 3600, "authorization_redis");
    // console.log("Token saved to Redis:", token);
    const cloneData = { ...user.dataValues };
    cloneData.atk = token;
    return res.status(200).json({
      ptGroup: 44567,
      ptCommand: 44568,
      token: token,
      params: cloneData,
      result: "success",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
