import sequelize from "../../db"
import {
    DataTypes, InstanceDestroyOptions, Model
} from "sequelize"
import TodoomHistory from "./todoom_history.model";

const Todoom = sequelize.define('Todoom', {
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
        validate: {
            isAlphanumeric: true
        }
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
        validate: {
            isAlphanumeric: true
        }
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
        validate: {
            isAlphanumeric: true
        }
    },
}, {
    tableName: 'todoom',
    timestamps: true,
})

Todoom.afterDestroy(async (instance:Model<any,any>, options:InstanceDestroyOptions):Promise<void> => {
    await TodoomHistory.create(instance.get(), { transaction: options.transaction }) as any
})

export default Todoom