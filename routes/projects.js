const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

// @route GET /
// @desc Get all projects
router.get('/', ensureAuthenticated, (req, res) => {
  User.hasMany(Project, { foreignKey: 'author_id' });
  Project.belongsTo(User, { foreignKey: 'author_id' });
  Project.findAll({
    include: [
      {
        model: User,
        where: ['author_id = id']
      }
    ]
  })
    .then(projects => {
      console.log(projects);
      res.render('projects', {
        projects,
        user: req.user
      });
    })
    .catch(err => console.error(err));
});

// @route GET /add
// @desc Add project form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_project');
});

// @route POST /add
// @desc Add new project
router.post('/add', ensureAuthenticated, (req, res) => {
  const { title, github, description } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.render('add_project', {
      errors,
      title,
      github,
      description
    });
  } else {
    Project.create({
      title,
      github,
      description,
      author_id: req.user.id
    })
      .then(() => res.redirect('/projects'))
      .catch(err => console.log(err));
  }
});

module.exports = router;
