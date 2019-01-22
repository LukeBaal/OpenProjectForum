const express = require('express');
const Project = require('../models/Project');
const Post = require('../models/Post');
const User = require('../models/User');
const Vote = require('../models/Vote');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router({ mergeParams: true });

// @route GET /
// @desc Main forum page for project
router.get('/', ensureAuthenticated, (req, res) => {
  Post.findAll({
    include: [
      {
        model: Project
      },
      {
        model: User
      }
    ],
    where: {
      project_id: req.params.project_id
    }
  })
    .then(posts => {
      res.render('forum', {
        errors: {},
        posts,
        user: req.user,
        project_id: req.params.project_id
      });
    })
    .catch(err => console.error(err));
});

// @route GET /
// @desc Get add post form
// router.get('/', ensureAuthenticated, (req, res) => {
//   res.render('add_post', {
//     user: req.user,
//     project_id: req.params.project_id
//   });
// });

// @route POST /add
// @desc Create new post
router.post('/add', ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(`/projects/${req.params.project_id}/forum`);
  } else {
    Post.create({
      title,
      body,
      user_id: req.user.id,
      project_id: req.params.project_id
    })
      .then(() => res.redirect(`/projects/${req.params.project_id}/forum`))
      .catch(err => console.log(err));
  }
});

// @route GET /edit/:post_id
// @desc Get edit form
router.get('/edit/:post_id', ensureAuthenticated, (req, res) => {
  Post.findByPk(req.params.post_id)
    .then(post => {
      const { title, body } = post;
      res.render('edit_post', {
        errors: {},
        title,
        body,
        project_id: req.params.project_id
      });
    })
    .catch(err => console.log(err));
});

// @route PUT /edit/:post_id
// @desc Edit post with given id
router.put('/edit/:post_id', ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(`/projects/${req.params.project_id}/forum`);
  } else {
    Post.update(
      {
        title,
        body,
        user_id: req.user.id,
        project_id: req.params.project_id
      },
      {
        where: {
          id: req.params.post_id
        }
      }
    )
      .then(() => res.redirect(`/projects/${req.params.project_id}/forum`))
      .catch(err => console.log(err));
  }
});

// @route DELETE /:post_id
// @desc delete post
router.delete('/:post_id', ensureAuthenticated, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.post_id
    }
  }).then(post => {
    res.redirect(`/projects/${req.params.project_id}/forum`);
  });
});

// @route PUT /:post_id/upvote
// @desc Increment the given post's rating
router.put('/:post_id/upvote', ensureAuthenticated, (req, res) => {
  Vote.findOne({
    where: {
      user_id: req.user.id,
      post_id: req.params.post_id
    }
  }).then(vote => {
    if (vote) {
      console.log('Already voted');
    } else {
      Post.increment('rating', {
        where: {
          id: req.params.post_id
        }
      })
        .then(() => {
          Vote.create({
            user_id: req.user.id,
            post_id: req.params.post_id
          })
            .then(() =>
              res.redirect(`/projects/${req.params.project_id}/forum`)
            )
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  });
});

// @route PUT /:post_id/downvote
// @desc Decrement the given post's rating
router.put('/:post_id/downvote', ensureAuthenticated, (req, res) => {
  Post.decrement('rating', {
    where: {
      id: req.params.post_id
    }
  })
    .then(() => res.redirect(`/projects/${req.params.project_id}/forum`))
    .catch(err => console.log(err));
});

module.exports = router;
