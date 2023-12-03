import sequelize from "../../db"
import {
    DataTypes, InstanceDestroyOptions, Model
} from "sequelize"
import User from "./user.model"
import Group from "./group.model"
import Todoom from "./todoom.model"

const UserGroup = sequelize.define('UserGroup', {}, {
        tableName: 'user_group',
        timestamps: false,
        primaryKey: true
} as any)

User.belongsToMany(Group, { through: UserGroup })
Group.belongsToMany(User, { through: UserGroup })

UserGroup.afterDestroy(async (instance: Model<any, any>, options: InstanceDestroyOptions): Promise<void> => {
    const groupId = instance.get().GroupId;

    await Todoom.update(
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