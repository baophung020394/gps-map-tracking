// user.ts
// src/models/user.ts

import { Sequelize, Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

interface UserAttributes extends Model {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): boolean;
}

export default (sequelize: Sequelize) => {
  const User = sequelize.define<UserAttributes>(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
          const hashedPassword = bcrypt.hashSync(value, 8);
          this.setDataValue("password", hashedPassword);
        },
      },
    },
    {
      tableName: "Users",
    }
  );

  User.prototype.comparePassword = function (
    candidatePassword: string
  ): boolean {
    return bcrypt.compareSync(candidatePassword, this.password);
  };

  return User;
};
