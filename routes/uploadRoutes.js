
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Rota para upload de imagens (protegida)
router.post('/images', auth, upload.single('image'), uploadController.uploadImage);

module.exports = router;
