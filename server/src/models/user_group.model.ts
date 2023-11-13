import sequelize from "../../db";
import { DataTypes } from "sequelize";

const UserGroup = sequelize.define('UserGroup', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', // Assuming your User model is named 'User'
        key: 'id',
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Group', // Assuming your Group model is named 'Group'
        key: 'id',
      },
    },
}, {
    tableName: 'user_group',
    timestamps: false,
    primaryKey: true, // Sequelize will automatically set the primary key based on the model attributes
    foreignKeys: [
      {
        name: 'user_group_user_id_fk',
        fields: ['user_id'],
        references: {
          table: 'user',
          field: 'id',
        },
      },
      {
        name: 'user_group_group_id_fk',
        fields: ['group_id'],
        references: {
          table: 'group',
          field: 'id',
        },
      },
    ],
} as any);

export default UserGroup