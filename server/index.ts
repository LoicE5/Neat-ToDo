import dotenv from "dotenv"
dotenv.config()
import express, { Express } from "express"
import passport from "passport"
import sequelize from "./db"
import routerAuth from "./src/routes/auth.route"
import routerUser from "./src/routes/user.route"
import jwtStrategy from "./src/utils/jwt_strategy"
import routerGroup from "./src/routes/group.route"

const app:Express = express()
const port:number = Number(process.env.PORT) || 3001

passport.use(jwtStrategy)

app.use(express.json())
app.use(express.text())

app.use('/auth', routerAuth)
app.use('/user', passport.authenticate('jwt', { session: false }), routerUser)
app.use('/group', passport.authenticate('jwt', { session: false }) , routerGroup)

app.listen(port, ():void => console.info(`The server is listening to the port ${port}`))

sequelize.sync({ force: false }).then(() => {
    console.info('The database have been synced')
})
