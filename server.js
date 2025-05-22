
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const martialArtsRoutes = require('./routes/martialArtsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const postRoutes = require('./routes/postRoutes');
const pollRoutes = require('./routes/pollRoutes');

// Inicialização do Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/martial-arts', martialArtsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/polls', pollRoutes);

// Rota inicial para teste
app.get('/', (req, res) => {
  res.send('API do MartialWorld está funcionando!');
});

// Conexão com MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Inicialização do servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
