const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { ensureAuthenticated } = require('../config/auth');

const User = require('../models/User');

// User Profile
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('user', {
    user: req.user
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
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.emailexists = 'Email already exists';
        res.render('register', {
          errors,
          username,
          password,
          password2,
          email
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            // Add user to DB
            User.create({
              username,
              password: hash,
              email
            })
              .then(user => res.redirect('/user'))
              .catch(err => console.error(err));
          });
        });
      }
    });
  }
});

// @route PUT /bio
// @desc Update user bio
router.post('/bio', (req, res) => {
  const { bio } = req.body;
  if (!bio) {
    res.redirect('/user');
  }
  User.update(
    { bio },
    {
      where: {
        id: req.user.id
      }
    }
  )
    .then(() => res.redirect('/user'))
    .catch(err => console.log(err));
});

// @route GET /login
// @desc Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// @route POST /login
// @desc login authentication
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/user/login'
  })(req, res, next);
});

// @route GET /logout
// @desc logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/user/login');
});

module.exports = router;
