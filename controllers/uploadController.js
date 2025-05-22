
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum arquivo fornecido' 
      });
    }

    // Log para depuração
    console.log('Arquivo recebido:', req.file);

    // Upload do arquivo para o Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'martial_arts',
    });

    // Remover o arquivo temporário após upload
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log('Upload bem-sucedido:', result.secure_url);

    // Retornar a URL da imagem
    res.json({
      success: true,
      imageUrl: result.secure_url
    });
  } catch (error) {
    console.error('Erro no upload da imagem:', error);

    // Tentar remover o arquivo temporário em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false,
      message: 'Erro ao fazer upload da imagem',
      error: error.message 
    });
  }
};
