
const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const auth = require('../middleware/auth');

// Rotas de enquetes
router.get('/martial-art/:martialArtId', pollController.getByMartialArt);
router.post('/', auth, pollController.create);
router.post('/:pollId/vote', auth, pollController.vote);
router.get('/:pollId', pollController.getById);

module.exports = router;
