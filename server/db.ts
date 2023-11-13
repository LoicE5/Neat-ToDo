import { Sequelize, Options } from "sequelize"

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
} as Options)

sequelize.authenticate()
    .then(():void => {
        console.info('Connection to the database has been established successfully.')
        })
    .catch((err:string) => {
        console.error('Unable to connect to the database :',err)
    })

export default sequelize