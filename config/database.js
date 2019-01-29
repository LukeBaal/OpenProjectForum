const Sequelize = require('sequelize');

module.exports = {
  production: new Sequelize(process.env.DATABASE_URL, {
    host: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    logging: true,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    ssl: true
  }),
  dev: new Sequelize('ospv', 'sqlite', 'example', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: 'db.sqlite'
  }),
  test: new Sequelize('ospv_test', 'sqlite', 'example', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: 'test_db.sqlite'
  })
};
