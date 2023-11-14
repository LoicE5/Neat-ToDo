import express, { Express } from "express"
import sequelize from "./db";
import User from "./src/models/user.model";
import UserGroup from "./src/models/user_group.model";
import Group from "./src/models/group.model";
import Todoom from "./src/models/todoom.model";
import TodoomHistory from "./src/models/todoom_history.model";
import routerAuth from "./src/routes/auth.route";

const app:Express = express();
const port:number = 3001;

app.use(express.json());
app.use(express.text());
app.use('/auth', routerAuth)

app.listen(port, ():void => console.info(`The server is listening to the port ${port}`))

sequelize.sync({ force: false }).then(() => {
    console.log('The database have been synced')
})

// TODO remove those when models are done
User.sync()
UserGroup.sync()
Group.sync()
Todoom.sync()
TodoomHistory.sync()