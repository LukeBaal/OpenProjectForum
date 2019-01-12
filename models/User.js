const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
  username: {
    type: Sequelize.TEXT
  },
  password: {
    type: Sequelize.TEXT
  },
  bio: {
    type: Sequelize.TEXT
  },
  email: {
    type: Sequelize.TEXT
  }
}, {
  underscored: true
});

module.exports = User;