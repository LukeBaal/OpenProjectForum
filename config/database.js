const Sequelize = require('sequelize');

module.exports = new Sequelize('ospv', 'sqlite', 'example', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: 'database.sqlite'
});
