const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { admin, db } = require('./servicos/firebaseAdmin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const verificaJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ erro: 'Erro no token' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: 'Token mal formatado' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    
    req.usuarioId = decoded.id;
    return next();
  });
};

const rotasAuth = require('./rotas/auth');
const rotasCursos = require('./rotas/cursos');
const rotasEstudantes = require('./rotas/estudantes');
const rotasProfessores = require('./rotas/professores');

app.use('/api/auth', rotasAuth);
app.use('/api/cursos', rotasCursos);
app.use('/api/estudantes', rotasEstudantes);
app.use('/api/professores', rotasProfessores);

app.get('/api/teste', (req, res) => {
  res.json({
    mensagem: 'API EduNext funcionando!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

app.delete('/api/usuario', verificaJwt, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    
    await admin.auth().deleteUser(usuarioId);
    
    const usuarioRef = db.collection('usuarios').doc(usuarioId);
    await usuarioRef.delete();
    
    const inscricoesQuery = await db.collection('inscricoes').where('usuarioId', '==', usuarioId).get();
    const batch = db.batch();
    
    inscricoesQuery.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    res.status(200).json({ mensagem: 'Conta e dados removidos com sucesso' });
  } catch (erro) {
    console.error('Erro ao remover usuário:', erro);
    res.status(500).json({ erro: 'Erro ao remover usuário e dados' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});