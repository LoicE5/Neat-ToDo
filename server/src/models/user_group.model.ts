import sequelize from "../../db"
import User from "./user.model"
import Group from "./group.model"

const UserGroup = sequelize.define('UserGroup', {}, {
        tableName: 'user_group',
        timestamps: false,
        primaryKey: true
} as any)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

export default UserGroup