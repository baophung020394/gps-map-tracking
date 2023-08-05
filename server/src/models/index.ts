import { Sequelize } from "sequelize";
import deviceModel from "./device";
import HistoryModel from "./history";
import HistoryLastModel from "./lastHitory";
import LatestModel from "./latest";
import UserModel from "./user";
import RoomModel from "./room";
import UserRoomModel from "./user-room";

const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
  }
);

const Device = deviceModel(sequelize);
const History = HistoryModel(sequelize);
const HistoryLast = HistoryLastModel(sequelize);
const Latest = LatestModel(sequelize);
const User = UserModel(sequelize);
const Room = RoomModel(sequelize);
const UserRoom = UserRoomModel(sequelize);

Device.hasMany(History, { foreignKey: "deviceId" });
Device.hasMany(HistoryLast, { foreignKey: "deviceId" });
Device.hasMany(Latest, { foreignKey: "deviceId" });
History.belongsTo(Device, { foreignKey: "deviceId" });
HistoryLast.belongsTo(Device, { foreignKey: "deviceId" });
HistoryLast.belongsTo(Device, { foreignKey: "deviceId" });
Latest.belongsTo(Device, { foreignKey: "deviceId" });
User.hasOne(Device, { foreignKey: "userId", as: "device" });
Device.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Room, { foreignKey: "userId" });
Room.belongsTo(User, {
  foreignKey: "userId",
});

sequelize.sync({ force: false }).then(async () => {
  console.log(`Database & tables created!`);
});

export { User, Room, UserRoom, Device, Latest, History, HistoryLast };
