const Sequelize = require('sequelize');
const db = require('../config/database')[process.env.NODE_ENV || 'dev'];
const User = require('./User');

const Project = db.define(
  'Project', {
    title: {
      type: Sequelize.STRING
    },
    github: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    }
  }, {
    underscored: true
  }
);

Project.belongsTo(User);
User.hasMany(Project);

module.exports = Project;