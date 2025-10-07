const express = require('express');
const { db, admin } = require('../servicos/firebaseAdmin');
const jwt = require('jsonwebtoken');

const router = express.Router();

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
    req.perfil = decoded.perfil;
    return next();
  });
};

const verificaProfessor = (req, res, next) => {
  if (req.perfil !== 'professor') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para professores' });
  }
  
  return next();
};

router.get('/cursos', verificaJwt, verificaProfessor, async (req, res) => {
  try {
    const professorId = req.usuarioId;
    
    const cursosSnapshot = await db.collection('cursos')
      .where('professorId', '==', professorId)
      .get();
    
    const cursos = [];
    
    cursosSnapshot.forEach(doc => {
      cursos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json(cursos);
  } catch (erro) {
    console.error('Erro ao listar cursos do professor:', erro);
    res.status(500).json({ erro: 'Erro ao listar cursos' });
  }
});

router.get('/cursos/:cursoId/estatisticas', verificaJwt, verificaProfessor, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const professorId = req.usuarioId;
    
    const cursoRef = db.collection('cursos').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    if (cursoDoc.data().professorId !== professorId) {
      return res.status(403).json({ erro: 'Você não tem permissão para acessar este curso' });
    }
    
    const inscricoesSnapshot = await db.collection('inscricoes')
      .where('cursoId', '==', cursoId)
      .get();
    
    const totalInscritos = inscricoesSnapshot.size;
    
    const quizzesSnapshot = await db.collection('quizzes')
      .where('cursoId', '==', cursoId)
      .get();
    
    const quizzes = [];
    quizzesSnapshot.forEach(doc => {
      quizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    const estatisticasQuizzes = [];
    
    for (const quiz of quizzes) {
      const resultadosSnapshot = await db.collection('resultadosQuiz')
        .where('quizId', '==', quiz.id)
        .get();
      
      let somaPercentual = 0;
      let totalRespostas = 0;
      
      resultadosSnapshot.forEach(doc => {
        somaPercentual += doc.data().percentualAcerto;
        totalRespostas++;
      });
      
      const mediaAcertos = totalRespostas > 0 ? somaPercentual / totalRespostas : 0;
      
      estatisticasQuizzes.push({
        quizId: quiz.id,
        titulo: quiz.titulo,
        totalRespostas,
        mediaAcertos
      });
    }
    
    res.status(200).json({
      cursoId,
      titulo: cursoDoc.data().titulo,
      totalInscritos,
      estatisticasQuizzes
    });
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas do curso' });
  }
});

module.exports = router;