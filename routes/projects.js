const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();

// @route GET /
// @desc Get all projects
router.get('/', ensureAuthenticated, (req, res) => {
  Project.findAll({
    include: [
      {
        model: User
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
  res.render('add_project', {
    errors: {}
  });
});

// @route POST /add
// @desc Add new project
router.post('/add', ensureAuthenticated, (req, res) => {
  let { title, github, description } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  description = description.trim();

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
      user_id: req.user.id
    })
      .then(() => res.redirect('/projects'))
      .catch(err => console.log(err));
  }
});

// @route GET /edit
// @desc Edit project form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Project.findByPk(req.params.id).then(project => {
    if (project) {
      console.log(`Project id: ${project.id}`);
      res.render('edit_project', {
        id: project.id,
        title: project.title,
        github: project.github,
        description: project.description,
        errors: {}
      });
    } else {
      res.redirect('/projects');
    }
  });
});

// @route PUT /edit
// @desc Edit project
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
  let { title, github, description } = req.body;
  const errors = {};

  if (description) {
    description = description.trim();
  }

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.render('edit_project', {
      errors,
      title,
      github,
      description
    });
  } else {
    Project.update(
      {
        title,
        github,
        description
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(() => res.redirect('/projects'))
      .catch(err => console.log(err));
  }
});

router.use('/:project_id/forum', require('./posts'));

module.exports = router;
