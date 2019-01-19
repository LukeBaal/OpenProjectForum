const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username'
      },
      (username, password, done) => {
        // Find matching user
        User.findOne({
          where: {
            username
          }
        }).then(user => {
          if (!user) {
            console.log('invalid username');
            return done(null, false, {
              message: 'Invalid username'
            });
          }
          // Compare passwords
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: 'Invalid password'
              });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findByPk(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => done(err, user));
  });
};
