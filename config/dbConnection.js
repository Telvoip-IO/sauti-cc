
const {Sequelize} = require('sequelize');
const dbConfig = require('./db');


let sequelize = null;

const connectWithRetry = () => {
    console.log('PostgreSQL connection: retrying...');
    sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
    });

    sequelize.authenticate()
        .then(() => {
            console.log('PostgreSQL connection established');
        })
        .catch(err => {
            console.log('PostgreSQL connection failed:', err);
            setTimeout(connectWithRetry, 5000); // wait 5 seconds before trying again
        });
}

connectWithRetry();

module.exports = sequelize;