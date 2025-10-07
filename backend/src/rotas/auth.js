const express = require('express');
const { admin } = require('../servicos/firebaseAdmin');
const { gerarToken } = require('../servicos/jwt');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ erro: 'Token do Firebase não fornecido' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const usuarioSnapshot = await admin.firestore().collection('usuarios').doc(uid).get();
    
    if (!usuarioSnapshot.exists) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    
    const usuario = usuarioSnapshot.data();
    const perfil = usuario.perfil || 'estudante';
    
    const token = gerarToken(uid, perfil);
    
    res.status(200).json({
      token,
      usuario: {
        id: uid,
        nome: usuario.nome,
        email: usuario.email,
        perfil
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro ao autenticar usuário' });
  }
});

router.post('/logout', (req, res) => {
  res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
});

module.exports = router;