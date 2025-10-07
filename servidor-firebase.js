const express = require('express');
const cors = require('cors');
const { db, auth } = require('./firebase-config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/teste', (req, res) => {
  res.json({
    mensagem: 'API EduNext com Firebase funcionando!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    firebase: 'Conectado'
  });
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.get();
    const usuarios = [];
    snapshot.forEach(doc => {
      usuarios.push({ id: doc.id, ...doc.data() });
    });
    res.json({ usuarios });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, tipo } = req.body;
    const usuario = {
      nome,
      email,
      tipo: tipo || 'estudante',
      dataCadastro: new Date().toISOString(),
      ativo: true
    };
    const docRef = await db.collection('usuarios').add(usuario);
    res.status(201).json({
      mensagem: 'Usuario criado com sucesso',
      id: docRef.id,
      usuario
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Firebase rodando na porta ${PORT}`);
  console.log('Acesse: http://localhost:3000/api/teste');
});
