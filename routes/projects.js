const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');
const getLatestPushDate = require('../github');

const router = express.Router();

// @route GET /
// @desc Get all projects
router.get('/', ensureAuthenticated, async (req, res) => {
  projects = await Project.findAll({
    include: [
      {
        model: User
      }
    ]
  });

  const pushDates = {};

  for (let project of projects) {
    if (project.github) {
      latestPushDate = await getLatestPushDate(project.github);
      pushDates[project.title] = latestPushDate;
    }
  }
  res.render('projects', {
    projects,
    pushDates,
    user: req.user
  });
});

// @route GET /add
// @desc Add project form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_project', {
    errors: {},
    user: req.user
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
// @param id ID of the project
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Project.findByPk(req.params.id).then(project => {
    if (project) {
      console.log(`Project id: ${project.id}`);
      res.render('edit_project', {
        user: req.user,
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
// @param id ID of the project
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

// @route DELETE /:project_id
// @desc Delete project
// @param project_id ID of the project
router.delete('/:project_id', ensureAuthenticated, (req, res) => {
  Project.destroy({
    where: {
      id: req.params.project_id,
      user_id: req.user.id
    }
  })
    .then(() => res.redirect('/projects'))
    .catch(err => console.log(err));
});

router.use('/:project_id/posts', require('./posts'));

module.exports = router;
