const express = require('express')
const router = express.Router();
const Project = require('../models/Project');
const Post = require('../models/Post');
const {
  ensureAuthenticated
} = require('../config/auth');

// @route GET /
// @desc Main forum page for project
router.get('/', ensureAuthenticated, (req, res) => {
  Post.findAll({
      include: [{
        model: 'Project'
      }, {
        model: 'User'
      }],
      where: {
        project_id: req.params.project_id
      }
    })
    .then(posts => {
      res.render('forum', {
        posts,
        user: req.user
      });
    })
    .catch(err => console.error(err));


  res.render('forum', {
    user: req.user
  });
});

module.exports = router;