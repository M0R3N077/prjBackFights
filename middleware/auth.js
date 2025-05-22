
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  // Verificar se o token está presente no header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Buscar usuário pelo ID do token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Anexar dados do usuário à requisição
    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(401).json({ message: 'Token inválido' });
  }
};
