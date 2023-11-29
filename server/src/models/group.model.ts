import sequelize from "../../db"
import {
    DataTypes
} from "sequelize"

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    tableName: 'group',
    timestamps: false,
})

export default Group