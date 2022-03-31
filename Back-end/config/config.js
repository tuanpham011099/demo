require('dotenv').config()
module.exports = {
    "development": {
        "username": process.env.DB_DEVELOPMENT_USER,
        "password": process.env.DB_DEVELOPMENT_PASSWORD,
        "database": process.env.DB_DEVELOPMENT_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "logging": false
    },
    "test": {
        "username": process.env.DB_TEST_USER,
        "password": process.env.DB_TEST_PASSWORD,
        "database": process.env.DB_TEST_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "logging": false
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "logging": false
    }
}