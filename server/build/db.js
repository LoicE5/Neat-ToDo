"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const isSSLEnabled = process.env.DB_SSL === 'true';
const sequelize = new sequelize_1.Sequelize(process.env.DB_DATABASE || 'neat_todo', process.env.DB_USER || 'admin', process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    ssl: isSSLEnabled,
    dialectOptions: {
        ssl: isSSLEnabled
    }
});
sequelize.authenticate()
    .then(() => {
    console.info('Connection to the database has been established successfully.');
})
    .catch((err) => {
    console.error('Unable to connect to the database :', err);
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map