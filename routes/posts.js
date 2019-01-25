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
  const { project_id } = req.params;

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
      project_id: project_id
    }
  })
    .then(posts => {
      res.render('posts', {
        errors: {},
        posts,
        user: req.user,
        project_id: project_id
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
  const { project_id } = req.params;
  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.render('add_post', {
      errors,
      user: req.user,
      project_id,
      title,
      commentBody: body
    });
  } else {
    Post.create({
      title,
      body,
      user_id: req.user.id,
      project_id
    })
      .then(() => res.redirect(`/projects/${project_id}/posts`))
      .catch(err => console.log(err));
  }
});

// @route GET /edit/:post_id
// @desc Get edit form
router.get('/edit/:post_id', ensureAuthenticated, (req, res) => {
  const { project_id, post_id } = req.params;
  Post.findByPk(post_id)
    .then(post => {
      const { id, title, body } = post;
      res.render('edit_post', {
        errors: {},
        id,
        title,
        postBody: body,
        project_id
      });
    })
    .catch(err => console.log(err));
});

// @route PUT /edit/:post_id
// @desc Edit post with given id
router.put('/edit/:post_id', ensureAuthenticated, (req, res) => {
  const { project_id, post_id } = req.params;

  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(`/projects/${project_id}/posts`);
  } else {
    Post.update(
      {
        title,
        body,
        user_id: req.user.id,
        project_id
      },
      {
        where: {
          id: post_id
        }
      }
    )
      .then(() => res.redirect(`/projects/${project_id}/posts`))
      .catch(err => console.log(err));
  }
});

// @route DELETE /:post_id
// @desc delete post
router.delete('/:post_id', ensureAuthenticated, (req, res) => {
  const { project_id, post_id } = req.params;
  Post.destroy({
    where: {
      id: post_id,
      user_id: req.user.id
    }
  })
    .then(post => {
      res.redirect(`/projects/${project_id}/posts`);
    })
    .catch(err => console.log(err));
});

// @route PUT /:post_id/upvote
// @desc Increment the given post's rating
router.put('/:post_id/upvote', ensureAuthenticated, (req, res) => {
  const { project_id, post_id } = req.params;
  Vote.findOne({
    where: {
      user_id: req.user.id,
      post_id
    }
  }).then(vote => {
    if (vote) {
      res.redirect(`/projects/${project_id}/posts/${post_id}`);
    } else {
      Post.increment('rating', {
        where: {
          id: post_id
        }
      })
        .then(() => {
          Vote.create({
            user_id: req.user.id,
            post_id
          })
            .then(() =>
              res.redirect(`/projects/${project_id}/posts/${post_id}`)
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
  const { project_id, post_id } = req.params;
  Vote.findOne({
    where: {
      user_id: req.user.id,
      post_id
    }
  }).then(vote => {
    if (vote) {
      res.redirect(`/projects/${project_id}/posts/${post_id}?voted=true`);
    } else {
      Post.decrement('rating', {
        where: {
          id: post_id
        }
      })
        .then(() => {
          Vote.create({
            user_id: req.user.id,
            post_id
          })
            .then(() =>
              res.redirect(`/projects/${project_id}/posts/${post_id}`)
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
  const { project_id, post_id } = req.params;
  Post.findByPk(post_id, {
    include: [
      {
        model: User
      }
    ]
  })
    .then(post => {
      if (!post) {
        res.redirect(`/projects/${project_id}/posts`);
      }

      Comment.findAll({
        include: [
          {
            model: User
          }
        ],
        where: {
          post_id
        }
      })
        .then(comments => {
          res.render('post', {
            user: req.user,
            project_id,
            post,
            comments,
            errors: {}
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.use('/:post_id/comments', require('./comments'));

module.exports = router;
