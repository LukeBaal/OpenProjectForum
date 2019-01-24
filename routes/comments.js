const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router({ mergeParams: true });

// @route POST
// @desc Add comment to post
router.post('/add', ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(
      `/projects/${req.params.project_id}/posts/${req.params.post_id}`
    );
  } else {
    Comment.create({
      title,
      body,
      user_id: req.user.id,
      post_id: req.params.post_id
    })
      .then(() =>
        res.redirect(
          `/projects/${req.params.project_id}/posts/${req.params.post_id}`
        )
      )
      .catch(err => console.log(err));
  }
});

// @route GET /edit/:comment_id
// @desc Get edit comment form
router.get('/edit/:comment_id', ensureAuthenticated, (req, res) => {
  Comment.findByPk(req.params.comment_id).then(comment => {
    if (!comment) {
      res.redirect(
        `/projects/${req.params.project_id}/posts/${req.params.post_id}`
      );
    }
    console.log(comment);
    res.render('edit_comment', {
      errors: {},
      user: req.user,
      project_id: req.params.project_id,
      post_id: req.params.post_id,
      comment: comment
    });
  });
});

// @route PUT /edit/:comment_id
// @desc Edit post with given id
router.put('/edit/:comment_id', ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const errors = {};

  if (!title) {
    errors.title = 'Please enter a title';
  }

  if (Object.keys(errors).length > 0) {
    res.redirect(
      `/projects/${req.params.project_id}/posts/${req.params.post_id}`
    );
  } else {
    Comment.update(
      {
        title,
        body,
        user_id: req.user.id,
        post_id: req.params.post_id
      },
      {
        where: {
          id: req.params.comment_id
        }
      }
    )
      .then(() =>
        res.redirect(
          `/projects/${req.params.project_id}/posts/${req.params.post_id}`
        )
      )
      .catch(err => console.log(err));
  }
});

// @route DELETE /:comment_id
// @desc delete comment
router.delete('/:comment_id', ensureAuthenticated, (req, res) => {
  const { project_id, post_id, comment_id } = req.params;
  Comment.destroy({
    where: {
      id: req.params.comment_id,
      user_id: req.user.id
    }
  })
    .then(() => {
      res.redirect(`/projects/${project_id}/posts/${post_id}`);
    })
    .catch(err => console.log(err));
});

module.exports = router;
