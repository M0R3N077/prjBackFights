
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const pollController = require('../controllers/pollController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Posts routes
router.get('/martial-art/:martialArtId', postController.getPostsByMartialArt);
router.post('/', auth, upload.single('media'), postController.createPost);
router.post('/:postId/reaction', auth, postController.toggleReaction);
router.post('/:postId/comment', auth, postController.addComment);
router.delete('/:postId', auth, postController.deletePost);

// Polls routes
router.get('/polls/martial-art/:martialArtId', pollController.getByMartialArt);
router.post('/polls', auth, pollController.create);
router.post('/polls/:pollId/vote', auth, pollController.vote);
router.get('/polls/:pollId', pollController.getById);

module.exports = router;
