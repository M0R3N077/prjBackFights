
const express = require('express');
const router = express.Router();
const martialArtController = require('../controllers/martialArtController');
const auth = require('../middleware/auth');

// Rotas públicas
router.get('/', martialArtController.getAllMartialArts);
router.get('/:id', martialArtController.getMartialArtById);

// Rotas protegidas
router.post('/', auth, martialArtController.createMartialArt);
router.put('/:id', auth, martialArtController.updateMartialArt);
router.delete('/:id', auth, martialArtController.deleteMartialArt);

module.exports = router;
