import { Sequelize } from "sequelize";
import deviceModel from "./device";
import HistoryModel from "./history";
import HistoryLastModel from "./lastHitory";

console.log("DB_DATABASE", process.env.DB_DATABASE);
console.log("DB_USER", process.env.DB_USER);
console.log("DB_PASSWORD", process.env.DB_PASSWORD);
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

Device.hasMany(History, { foreignKey: "deviceId" });
Device.hasMany(HistoryLast, { foreignKey: "deviceId" });
History.belongsTo(Device, { foreignKey: "deviceId" });
HistoryLast.belongsTo(Device, { foreignKey: "deviceId" });

sequelize.sync({ force: false }).then(async () => {
  console.log(`Database & tables created!`);
});

// function getRandomLatitude() {
//   // Phạm vi latitude của Việt Nam
//   const minLatitude = 8.1752;
//   const maxLatitude = 23.3934;
//   // Tạo ngẫu nhiên giá trị latitude trong phạm vi
//   return Math.random() * (maxLatitude - minLatitude) + minLatitude;
// }

// function getRandomLongitude() {
//   // Phạm vi longitude của Việt Nam
//   const minLongitude = 102.1446;
//   const maxLongitude = 109.4696;
//   // Tạo ngẫu nhiên giá trị longitude trong phạm vi
//   return Math.random() * (maxLongitude - minLongitude) + minLongitude;
// }

// (async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log("Database connected and tables created!");

//     const devices = [
//       { name: "Device 1" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       { name: "Device 2" },
//       // Add more devices here
//     ];
//     const createdDevices = await Device.bulkCreate(devices, {
//       returning: true,
//     });

//     const currentDate = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     for (const device of createdDevices) {
//       const histories = [];
//       const historyLasts = [];

//       for (let i = 0; i < 30; i++) {
//         const date = new Date(currentDate);
//         date.setDate(currentDate.getDate() - i);

//         histories.push({
//           deviceName: device.name,
//           address: "Address",
//           latitude: getRandomLatitude(),
//           longitude: getRandomLongitude(),
//           deviceId: device.deviceId,
//           date,
//         });

//         if (date >= thirtyDaysAgo) {
//           historyLasts.push({
//             deviceName: device.name,
//             address: "Address",
//             latitude: getRandomLatitude(),
//             longitude: getRandomLongitude(),
//             deviceId: device.deviceId,
//             date,
//           });
//         }
//       }

//       // Trước vòng lặp for (const device of createdDevices)
//       const limitedHistories = histories.slice(0, 30);
//       const limitedHistoryLasts = historyLasts.slice(0, 30);

//       await History.bulkCreate(limitedHistories);
//       await HistoryLast.bulkCreate(limitedHistoryLasts);
//     }

//     console.log("Data inserted successfully!");
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     sequelize.close();
//   }
// })();

export { Device, History, HistoryLast };
