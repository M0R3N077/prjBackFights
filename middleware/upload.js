
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Certificar-se de que o diretório de uploads existe
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Garantir nome de arquivo único e sem caracteres especiais
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, 'upload-' + uniqueSuffix + fileExt);
  }
});

// Filtro para aceitar imagens e vídeos
const fileFilter = (req, file, cb) => {
  console.log('Recebendo arquivo:', file.mimetype);
  // Aceitar imagens e vídeos
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens ou vídeos são permitidos'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
