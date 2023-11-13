import sequelize from "../../db";
import { DataTypes } from "sequelize";


const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: 'user_email_nickname', // Add this line for the unique constraint
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: 'user_email_nickname', // Add this line for the unique constraint
    },
  }, {
    timestamps: true, // Set to true if your table has createdAt and updatedAt columns
  });
// Sync the model with the database
User.sync({ force: false }).then(() => {
  console.log('User model synced with database');
}).catch((error) => {
  console.error('Error syncing User model with database:', error);
});

export default User