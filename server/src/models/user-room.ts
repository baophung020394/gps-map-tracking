import { Sequelize, Model, DataTypes } from "sequelize";

interface UserRoomAttributes extends Model {
  id: number;
  userId: number;
  roomId: number;
}

export default (sequelize: Sequelize) => {
  const UserRoom = sequelize.define<UserRoomAttributes>(
    "UserRoom",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "UserRooms",
    }
  );

  return UserRoom;
};
