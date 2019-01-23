const Sequelize = require('sequelize');
const db = require('../config/database')[process.env.NODE_ENV || 'dev'];
const Post = require('./Post');
const User = require('./User');

const Comment = db.define(
  'Comment',
  {
    title: {
      type: Sequelize.STRING
    },
    body: {
      type: Sequelize.STRING
    },
    rating: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    underscored: true
  }
);

Comment.belongsTo(Post);
Comment.belongsTo(User);
Post.hasMany(Comment);
User.hasMany(Comment);

module.exports = Comment;
