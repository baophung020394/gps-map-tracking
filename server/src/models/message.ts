// Message
import { Sequelize, Model, DataTypes } from "sequelize";

interface MessageAttributes extends Model {
  id: number;
  content: string;
  image: string | null;
  file: string | null;
  roomId: number;
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "Messages",
    }
  );

  return Message;
};
