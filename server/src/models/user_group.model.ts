import sequelize from "../../db"
import {
    DataTypes, InstanceDestroyOptions, Model
} from "sequelize"
import User from "./user.model"
import Group from "./group.model"
import Todo from "./todo.model"

const UserGroup = sequelize.define('UserGroup', {}, {
        tableName: 'user_group',
        timestamps: false,
        primaryKey: true
} as any)

User.belongsToMany(Group, { through: UserGroup, onDelete: 'cascade', foreignKey: 'UserId' })
Group.belongsToMany(User, { through: UserGroup, onDelete: 'cascade', foreignKey: 'GroupId' })

Group.beforeDestroy(async (instance: Model<any, any>, options: InstanceDestroyOptions): Promise<void> => {
    const groupId = instance.get().id

    // Manually delete Todos associated with the group
    await Todo.destroy({
        where: {
            group_id: groupId,
        },
        transaction: options.transaction
    })

    await UserGroup.destroy({
        where: {
            GroupId: groupId
        },
        transaction: options.transaction
    })
})

UserGroup.afterDestroy(async (instance: Model<any, any>, options: InstanceDestroyOptions): Promise<void> => {
    const groupId = instance.get().GroupId

    await Todo.update(
        { group_id: null },
        {
          where: {
            group_id: groupId,
          },
          transaction: options.transaction,
        }
      )
    }
)

export default UserGroup