import sequelize from "../../db"
import { DataTypes } from "sequelize"

const TodoomHistory = sequelize.define('TodoomHistory', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Group',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
    },
    deadline: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING(30),
      defaultValue: 'not_started',
      allowNull: false,
    },
    assignee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  }, {
    tableName: 'todoom_history',
    timestamps: true,
  })  

export default TodoomHistory