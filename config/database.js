const Sequelize = require('sequelize');

module.exports = {
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