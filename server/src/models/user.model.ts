import sequelize from "../../db"
import {
    DataTypes
} from "sequelize"

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
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
    }, {
        tableName: 'user',
        timestamps: false,
        uniqueKeys: {
            user_unique: {
                fields: ['email', 'nickname'],
            },
        },
} as any)

export default User