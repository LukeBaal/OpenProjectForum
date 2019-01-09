const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// User Profile
router.get('/', (req, res) => {
  res.render('user', {
    username: 'Test user',
    email: 'test@gmail.com',
    bio: 'I do things.'
  });
});

// Register
router.get('/register', (req, res) => {
  res.render('register');
});

// @route POST /register
// @desc Create user
router.post('/register', (req, res) => {
  let { username, password, password2, email } = req.body;
  let errors = {};

  if (!username) {
    errors.username = 'Please enter a username';
  }
  if (!password) {
    errors.password = 'Please enter a password';
  }
  if (!password2) {
    errors.password2 = 'Please confirm password';
  }
  if (password !== password2) {
    errors.passwordmatch = 'Passwords must match';
  }

  if (Object.keys(errors).length > 0) {
    res.render('register', {
      errors,
      username,
      password,
      password2,
      email
    });
  }

  // TODO: Use bcrypt to encrypt password
  // Add user to DB
  User.create({
    username,
    password,
    email
  })
    .then(user => res.redirect('/user'))
    .catch(err => console.error(err));
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
