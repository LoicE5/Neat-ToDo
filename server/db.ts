import { Sequelize, Options } from "sequelize"

const sequelize = new Sequelize(
    process.env.DB_NAME || 'neat_todo',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false
    } as Options
)

sequelize.authenticate()
    .then(():void => {
        console.info('Connection to the database has been established successfully.')
    })
    .catch((err:string) => {
        console.error('Unable to connect to the database :',err)
    })

export default sequelize