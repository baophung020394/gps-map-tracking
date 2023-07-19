import { Sequelize, Model, DataTypes } from "sequelize";
import { History, HistoryLast } from ".";

interface DeviceAttributes extends Model {
  deviceId: number;
  name: string;
}

export default (sequelize: Sequelize) => {
  const Device = sequelize.define<DeviceAttributes>("Device", {
    deviceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  });

  return Device;
};
