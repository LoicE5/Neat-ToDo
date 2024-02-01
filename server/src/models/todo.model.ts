import sequelize from "../../db"
import {
    DataTypes, InstanceDestroyOptions, Model
} from "sequelize"
import TodoHistory from "./todo_history.model"
import User from "./user.model"
import Group from "./group.model"

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'group_',
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
            model: 'user_',
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
            model: 'user_',
            key: 'id',
        },
        validate: {
            isAlphanumeric: true
        }
    },
}, {
    timestamps: true,
    tableName: 'todo_',
    freezeTableName: true
})

Todo.belongsTo(User, { as: 'author', foreignKey: 'author_id' })
Todo.belongsTo(User, { as: 'assignee', foreignKey: 'assignee_id' })
Todo.belongsTo(Group, { as: 'group', foreignKey: 'group_id' })

Todo.afterDestroy(async (instance:Model<any,any>, options:InstanceDestroyOptions):Promise<void> => {
    await TodoHistory.create(instance.get(), { transaction: options.transaction }) as any
})

export default Todo