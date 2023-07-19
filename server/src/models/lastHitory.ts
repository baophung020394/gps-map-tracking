import { Sequelize, Model, DataTypes } from "sequelize";
import { Device } from ".";

interface HistoryLastInstance extends Model {
  id: number;
  deviceName: string;
  address: string;
  latitude: number;
  longitude: number;
  deviceId: number;
  date: Date;
}

export default (sequelize: Sequelize) => {
  const HistoryLast = sequelize.define<HistoryLastInstance>("HistoryLast", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deviceName: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    deviceId: DataTypes.INTEGER,
    date: DataTypes.DATE,
  });

  return HistoryLast;
};
