const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const {
  ensureAuthenticated
} = require('../config/auth');

const User = require('../models/User');

// Register
router.get('/register', (req, res) => {
  res.render('register', {
    errors: {}
  });
});

// @route POST /register
// @desc Create user
router.post('/register', (req, res) => {
  let {
    username,
    password,
    password2,
    email
  } = req.body;
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
    User.findOne({
      where: {
        username: username
      }
    }).then(user => {
      if (user) {
        errors.username = 'Username already exists';
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
              .then(user => res.redirect(`/user/profile/${username}`))
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
  const {
    bio
  } = req.body;
  if (!bio) {
    res.redirect('/user');
  }
  User.update({
      bio
    }, {
      where: {
        id: req.user.id
      }
    })
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
    successRedirect: `/user/profile/1`,
    failureRedirect: '/user/login'
  })(req, res, next);
});

// @route GET /logout
// @desc logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/user/login');
});

// User Profile
router.get('/profile/:username', ensureAuthenticated, (req, res) => {
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then(user => {
    if (user) {
      res.render('user', {
        user,
        auth_user: req.user
      });
    } else {
      res.redirect('/projects');
    }
  });
});

module.exports = router;