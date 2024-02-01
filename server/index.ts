import dotenv from "dotenv"
dotenv.config()
import express, { Express, Request, Response } from "express"
import cors from 'cors'
import passport from "passport"
import sequelize from "./db"
import routerAuth from "./src/routes/auth.route"
import routerUser from "./src/routes/user.route"
import jwtStrategy from "./src/utils/jwt_strategy"
import routerToDo from "./src/routes/todo.route"
import routerGroup from "./src/routes/group.route"
import { failRequest } from "./src/utils/functions"
const app:Express = express()
const port:number = Number(process.env.PORT) || 3001

passport.use(jwtStrategy)

app.use(express.json())
app.use(express.text())
app.use(cors({origin: 'http://localhost:3000'}))

app.use('/auth', routerAuth)
app.use('/user', passport.authenticate('jwt', { session: false }) , routerUser)
app.use('/todo', passport.authenticate('jwt', { session: false }), routerToDo)
app.use('/group', passport.authenticate('jwt', { session: false }), routerGroup)

app.all('/', (req:Request,res:Response):void=>failRequest(res,418,`You cannot pour coffee here, please use tea instead.`))

app.listen(port, (): void => console.info(`The server is listening to the port ${port}`))

sequelize.sync({ force: false }).then(() => {
    console.info('The database have been synced')
})
