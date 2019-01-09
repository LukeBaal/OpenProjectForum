const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Project = require('../models/Project');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get all projects
router.get('/', (req, res) => {
  Project.findAll()
    .then(projects => {
      res.render('projects', {
        projects
      });
    })
    .catch(err => console.error(err));
});

module.exports = router;
