const Sequelize = require('sequelize');
const db = require('../config/database');

const Project = db.define(
  'Project',
  {
    title: {
      type: Sequelize.STRING
    },
    github: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    user_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    underscored: true
  }
);

module.exports = Project;
