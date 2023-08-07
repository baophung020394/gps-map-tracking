import { Sequelize, Model, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
interface RoomAttributes extends Model {
  id: string;
  roomName: string;
  roomType: "channel" | "group" | "chat_1_1";
  roomProfileImage: string | null;
  roomDescription: string | null;
  userId: string;
  users: string[];
}

function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  const length = 24;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export default (sequelize: Sequelize) => {
  const Room = sequelize.define<RoomAttributes>(
    "Room",
    {
      id: {
        type: DataTypes.STRING, // Sử dụng kiểu UUID cho cột id
        defaultValue: () => uuidv4(), // Tạo giá trị mặc định là UUID ngẫu nhiên khi thêm mới bản ghi
        primaryKey: true,
      },
      roomName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["channel", "group", "chat_1_1"]],
        },
      },
      roomProfileImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      roomDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      users: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Loại dữ liệu mảng chứa chuỗi (string)
        allowNull: true,
        defaultValue: [], // Mặc định giá trị là một mảng rỗng khi tạo mới phòng
      },
    },
    {
      tableName: "Rooms",
    }
  );

  return Room;
};
