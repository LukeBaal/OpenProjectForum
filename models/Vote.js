const Sequelize = require('sequelize');
const db = require('../config/database')[process.env.NODE_ENV || 'dev'];
const Post = require('./Post');
const User = require('./User');

const Vote = db.define(
  'Vote',
  {},
  {
    underscored: true
  }
);

Vote.belongsTo(Post);
Vote.belongsTo(User);
Post.hasMany(Vote);
User.hasMany(Vote);

module.exports = Post;
