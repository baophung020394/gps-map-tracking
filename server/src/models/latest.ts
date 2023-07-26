import { DataTypes, Model, Sequelize } from "sequelize";

interface LatestInstance extends Model {
  id: number;
  deviceName: string;
  address: string;
  latitude: number;
  longitude: number;
  deviceId: number;
  date: Date;
  userId: number;
}

export default (sequelize: Sequelize) => {
  const Latest = sequelize.define<LatestInstance>("Latest", {
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
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
  });

  return Latest;
};
