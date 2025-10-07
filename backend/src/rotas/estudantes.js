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

router.get('/cursos', verificaJwt, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    
    const inscricoesSnapshot = await db.collection('inscricoes')
      .where('usuarioId', '==', usuarioId)
      .get();
    
    const cursosIds = [];
    inscricoesSnapshot.forEach(doc => {
      cursosIds.push(doc.data().cursoId);
    });
    
    const cursos = [];
    
    for (const cursoId of cursosIds) {
      const cursoDoc = await db.collection('cursos').doc(cursoId).get();
      
      if (cursoDoc.exists) {
        cursos.push({
          id: cursoDoc.id,
          ...cursoDoc.data()
        });
      }
    }
    
    res.status(200).json(cursos);
  } catch (erro) {
    console.error('Erro ao listar cursos do estudante:', erro);
    res.status(500).json({ erro: 'Erro ao listar cursos' });
  }
});

router.post('/cursos/:cursoId/inscrever', verificaJwt, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const usuarioId = req.usuarioId;
    
    const cursoRef = db.collection('cursos').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    const inscricaoRef = db.collection('inscricoes').doc(`${cursoId}_${usuarioId}`);
    const inscricaoDoc = await inscricaoRef.get();
    
    if (inscricaoDoc.exists) {
      return res.status(400).json({ erro: 'Usuário já inscrito neste curso' });
    }
    
    await inscricaoRef.set({
      cursoId,
      usuarioId,
      dataInscricao: admin.firestore.FieldValue.serverTimestamp(),
      progresso: 0
    });
    
    res.status(201).json({
      mensagem: 'Inscrição realizada com sucesso',
      cursoId,
      titulo: cursoDoc.data().titulo
    });
  } catch (erro) {
    console.error('Erro ao inscrever em curso:', erro);
    res.status(500).json({ erro: 'Erro ao realizar inscrição' });
  }
});

router.get('/progresso/:cursoId', verificaJwt, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const usuarioId = req.usuarioId;
    
    const inscricaoRef = db.collection('inscricoes').doc(`${cursoId}_${usuarioId}`);
    const inscricaoDoc = await inscricaoRef.get();
    
    if (!inscricaoDoc.exists) {
      return res.status(404).json({ erro: 'Inscrição não encontrada' });
    }
    
    const progressoRef = db.collection('progresso')
      .where('usuarioId', '==', usuarioId)
      .where('cursoId', '==', cursoId);
    
    const progressoSnapshot = await progressoRef.get();
    const conteudosConcluidos = [];
    
    progressoSnapshot.forEach(doc => {
      conteudosConcluidos.push(doc.data().conteudoId);
    });
    
    const quizzesRef = db.collection('resultadosQuiz')
      .where('usuarioId', '==', usuarioId)
      .where('cursoId', '==', cursoId);
    
    const quizzesSnapshot = await quizzesRef.get();
    const quizzesConcluidos = [];
    
    quizzesSnapshot.forEach(doc => {
      quizzesConcluidos.push({
        quizId: doc.data().quizId,
        pontuacao: doc.data().pontuacao,
        percentualAcerto: doc.data().percentualAcerto
      });
    });
    
    res.status(200).json({
      cursoId,
      conteudosConcluidos,
      quizzesConcluidos,
      progresso: inscricaoDoc.data().progresso
    });
  } catch (erro) {
    console.error('Erro ao buscar progresso:', erro);
    res.status(500).json({ erro: 'Erro ao buscar progresso' });
  }
});

router.post('/progresso/:cursoId/conteudo/:conteudoId', verificaJwt, async (req, res) => {
  try {
    const { cursoId, conteudoId } = req.params;
    const usuarioId = req.usuarioId;
    
    const inscricaoRef = db.collection('inscricoes').doc(`${cursoId}_${usuarioId}`);
    const inscricaoDoc = await inscricaoRef.get();
    
    if (!inscricaoDoc.exists) {
      return res.status(404).json({ erro: 'Inscrição não encontrada' });
    }
    
    const progressoRef = db.collection('progresso').doc(`${cursoId}_${usuarioId}_${conteudoId}`);
    
    await progressoRef.set({
      cursoId,
      usuarioId,
      conteudoId,
      dataConclusao: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const cursoRef = db.collection('cursos').doc(cursoId);
    const modulosSnapshot = await cursoRef.collection('modulos').get();
    
    let totalConteudos = 0;
    const modulosIds = [];
    
    modulosSnapshot.forEach(doc => {
      modulosIds.push(doc.id);
    });
    
    for (const moduloId of modulosIds) {
      const conteudosSnapshot = await cursoRef.collection('modulos').doc(moduloId).collection('conteudos').get();
      totalConteudos += conteudosSnapshot.size;
    }
    
    const progressoSnapshot = await db.collection('progresso')
      .where('usuarioId', '==', usuarioId)
      .where('cursoId', '==', cursoId)
      .get();
    
    const conteudosConcluidos = progressoSnapshot.size;
    const percentualProgresso = totalConteudos > 0 ? (conteudosConcluidos / totalConteudos) * 100 : 0;
    
    await inscricaoRef.update({
      progresso: percentualProgresso
    });
    
    res.status(200).json({
      mensagem: 'Progresso atualizado com sucesso',
      progresso: percentualProgresso
    });
  } catch (erro) {
    console.error('Erro ao atualizar progresso:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar progresso' });
  }
});

module.exports = router;