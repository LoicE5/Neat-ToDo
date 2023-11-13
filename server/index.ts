import express, { Express } from "express"
import sequelize from "./db";
import User from "./src/models/user.model";
import UserGroup from "./src/models/user_group.model";

const app:Express = express();
const port:number = 3001;

app.use(express.json());
app.use(express.text());

app.listen(port, ():void => console.info(`The server is listening to the port ${port}`))

sequelize.sync({ force: false }).then(() => {
    console.log('The database have been synced')
})

User.sync()
UserGroup.sync()