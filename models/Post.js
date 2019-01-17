const Sequelize = require('sequelize');
const db = require('../config/database')[process.env.NODE_ENV || 'dev'];
const Project = require('./Project');
const User = require('./User');

const Post = db.define(
  'Post', {
    title: {
      type: Sequelize.STRING
    },
    body: {
      type: Sequelize.STRING
    },
    rating: {
      type: Sequelize.INTEGER
    }
  }, {
    underscored: true
  }
);

Post.belongsTo(Project);
Post.belongsTo(User);
Project.hasMany(Post);
User.hasMany(Post);

module.exports = Post;