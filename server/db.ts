import { Sequelize, Options } from "sequelize"

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_PATH || './database.sqlite',
    logging: false
} as Options)

sequelize.authenticate()
    .then(():void => {
        console.info('Connection to the database has been established successfully.')
        })
    .catch((err:string) => {
        console.error('Unable to connect to the database :',err)
    })

export default sequelize