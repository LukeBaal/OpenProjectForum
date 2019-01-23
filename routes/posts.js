const express = require('express');
const Project = require('../models/Project');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router({ mergeParams: true });

// @route GET /
// @desc Get all posts for the project
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
      res.render('posts', {
        errors: {},
        posts,
        user: req.user,
        project_id: req.params.project_id,
        voted: req.query.voted
      });
    })
    .catch(err => console.error(err));
});

// @router GET /add
// @desc Get add post form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_post', {
    user: req.user,
    project_id: req.params.project_id,
    errors: {}
  });
});

// @route POST /add
// @desc Create new post
router.post('/add', ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(`/projects/${req.params.project_id}/posts`);
  } else {
    Post.create({
      title,
      body,
      user_id: req.user.id,
      project_id: req.params.project_id
    })
      .then(() => res.redirect(`/projects/${req.params.project_id}/posts`))
      .catch(err => console.log(err));
  }
});

// @route GET /edit/:post_id
// @desc Get edit form
router.get('/edit/:post_id', ensureAuthenticated, (req, res) => {
  Post.findByPk(req.params.post_id)
    .then(post => {
      const { id, title, body } = post;
      res.render('edit_post', {
        errors: {},
        id,
        title,
        postBody: body,
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
    res.redirect(`/projects/${req.params.project_id}/posts`);
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
      .then(() => res.redirect(`/projects/${req.params.project_id}/posts`))
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
    res.redirect(`/projects/${req.params.project_id}/posts`);
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
      res.redirect(
        `/projects/${req.params.project_id}/posts/${
          req.params.post_id
        }?voted=true`
      );
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
              res.redirect(
                `/projects/${req.params.project_id}/posts/${req.params.post_id}`
              )
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
  Vote.findOne({
    where: {
      user_id: req.user.id,
      post_id: req.params.post_id
    }
  }).then(vote => {
    if (vote) {
      res.redirect(
        `/projects/${req.params.project_id}/posts/${
          req.params.post_id
        }?voted=true`
      );
    } else {
      Post.decrement('rating', {
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
              res.redirect(
                `/projects/${req.params.project_id}/posts/${req.params.post_id}`
              )
            )
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  });
});

// @route GET /:post_id
// @desc Get Post details and comments
router.get('/:post_id', ensureAuthenticated, (req, res) => {
  Post.findByPk(req.params.post_id)
    .then(post => {
      if (!post) {
        res.redirect(`/projects/${req.params.project_id}/posts`);
      }

      Comment.findAll({
        where: {
          post_id: req.params.post_id
        }
      })
        .then(comments => {
          res.render('post', {
            user: req.user,
            project_id: req.params.project_id,
            post,
            comments,
            errors: {}
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
