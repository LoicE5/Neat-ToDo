import sequelize from "../../db"
import { DataTypes } from "sequelize"

const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
  }, {
    tableName: 'user', // Set the table name if it's not pluralized and underscored
    timestamps: false, // Set to true if you want Sequelize to create createdAt and updatedAt columns
    uniqueKeys: {
      user_unique: {
            fields: ['email', 'nickname'],
      },
    },
  } as any)
  
export default User