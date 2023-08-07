// Message
import { Sequelize, Model, DataTypes } from "sequelize";

interface MessageAttributes extends Model {
  id: number;
  content: string;
  image: string | null;
  file: string | null;
  roomId: string;
  userId: string;
  date: Date;
}

export default (sequelize: Sequelize) => {
  const Message = sequelize.define<MessageAttributes>(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // image: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // file: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      messageType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chatType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE, // Định nghĩa trường date với kiểu dữ liệu DATE
        allowNull: false,
        defaultValue: DataTypes.NOW, // Gán giá trị mặc định là thời điểm hiện tại
      },
    },
    {
      tableName: "Messages",
    }
  );

  return Message;
};
