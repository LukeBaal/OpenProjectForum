const Sequelize = require('sequelize');

module.exports = {
  production: new Sequelize('ospv', 'postgres', 'example', {
    host:
      'postgres://nvcthjgztcfoxn:017267e4e7246681d14062846bd33804ac725f580238105a6867503eef03e69e@ec2-23-23-184-76.compute-1.amazonaws.com:5432/d4nvvaqq8dql77',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
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
