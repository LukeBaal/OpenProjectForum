const Sequelize = require('sequelize');
const db = require('../config/database')[process.env.NODE_ENV || 'dev']

console.log('USER DEFINE: ' + process.env.NODE_ENV)
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