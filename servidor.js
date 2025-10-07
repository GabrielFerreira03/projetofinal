const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db } = require('./firebase-config');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/teste', (req, res) => {
  res.json({
    mensagem: 'API EduNext funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
