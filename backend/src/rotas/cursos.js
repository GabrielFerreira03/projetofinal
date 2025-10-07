const express = require('express');
const multer = require('multer');
const { admin, db, storage } = require('../servicos/firebaseAdmin');
const jwt = require('jsonwebtoken');

const router = express.Router();
const upload = multer({ memory: true });

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

router.get('/', async (req, res) => {
  try {
    const { categoria, nivel, preco } = req.query;
    let cursosRef = db.collection('cursos');
    
    if (categoria) {
      cursosRef = cursosRef.where('categoria', '==', categoria);
    }
    
    if (nivel) {
      cursosRef = cursosRef.where('nivel', '==', nivel);
    }
    
    if (preco) {
      cursosRef = cursosRef.where('preco', '<=', Number(preco));
    }
    
    const cursosSnapshot = await cursosRef.get();
    const cursos = [];
    
    cursosSnapshot.forEach(doc => {
      cursos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json(cursos);
  } catch (erro) {
    console.error('Erro ao listar cursos:', erro);
    res.status(500).json({ erro: 'Erro ao listar cursos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cursoId = req.params.id;
    const cursoDoc = await db.collection('cursos').doc(cursoId).get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    const curso = {
      id: cursoDoc.id,
      ...cursoDoc.data()
    };
    
    const modulosSnapshot = await db.collection('cursos').doc(cursoId).collection('modulos').get();
    const modulos = [];
    
    modulosSnapshot.forEach(doc => {
      modulos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    curso.modulos = modulos;
    
    res.status(200).json(curso);
  } catch (erro) {
    console.error('Erro ao buscar curso:', erro);
    res.status(500).json({ erro: 'Erro ao buscar detalhes do curso' });
  }
});

router.post('/', verificaJwt, verificaProfessor, async (req, res) => {
  try {
    const { titulo, descricao, categoria, nivel, preco } = req.body;
    
    if (!titulo || !descricao || !categoria || !nivel) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }
    
    const cursoRef = db.collection('cursos').doc();
    
    await cursoRef.set({
      titulo,
      descricao,
      categoria,
      nivel,
      preco: Number(preco) || 0,
      professorId: req.usuarioId,
      dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
      dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      id: cursoRef.id,
      mensagem: 'Curso criado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao criar curso:', erro);
    res.status(500).json({ erro: 'Erro ao criar curso' });
  }
});

router.put('/:id', verificaJwt, verificaProfessor, async (req, res) => {
  try {
    const cursoId = req.params.id;
    const { titulo, descricao, categoria, nivel, preco } = req.body;
    
    const cursoRef = db.collection('cursos').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    if (cursoDoc.data().professorId !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para editar este curso' });
    }
    
    const dadosAtualizados = {
      dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (titulo) dadosAtualizados.titulo = titulo;
    if (descricao) dadosAtualizados.descricao = descricao;
    if (categoria) dadosAtualizados.categoria = categoria;
    if (nivel) dadosAtualizados.nivel = nivel;
    if (preco !== undefined) dadosAtualizados.preco = Number(preco);
    
    await cursoRef.update(dadosAtualizados);
    
    res.status(200).json({
      id: cursoId,
      mensagem: 'Curso atualizado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao atualizar curso:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar curso' });
  }
});

router.delete('/:id', verificaJwt, verificaProfessor, async (req, res) => {
  try {
    const cursoId = req.params.id;
    const cursoRef = db.collection('cursos').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    if (cursoDoc.data().professorId !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para remover este curso' });
    }
    
    await cursoRef.delete();
    
    res.status(200).json({
      mensagem: 'Curso removido com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao remover curso:', erro);
    res.status(500).json({ erro: 'Erro ao remover curso' });
  }
});

router.post('/:id/upload', verificaJwt, verificaProfessor, upload.single('arquivo'), async (req, res) => {
  try {
    const cursoId = req.params.id;
    const { moduloId, tipoArquivo, titulo } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }
    
    const cursoRef = db.collection('cursos').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    if (cursoDoc.data().professorId !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para adicionar conteúdo a este curso' });
    }
    
    const arquivo = req.file;
    const extensao = arquivo.originalname.split('.').pop();
    const nomeArquivo = `cursos/${cursoId}/${moduloId}/${Date.now()}.${extensao}`;
    
    const bucket = storage.bucket();
    const fileRef = bucket.file(nomeArquivo);
    
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: arquivo.mimetype
      }
    });
    
    stream.on('error', (erro) => {
      console.error('Erro ao fazer upload:', erro);
      res.status(500).json({ erro: 'Erro ao fazer upload do arquivo' });
    });
    
    stream.on('finish', async () => {
      await fileRef.makePublic();
      
      const urlArquivo = `https://storage.googleapis.com/${bucket.name}/${nomeArquivo}`;
      
      let moduloRef;
      
      if (moduloId) {
        moduloRef = cursoRef.collection('modulos').doc(moduloId);
        const moduloDoc = await moduloRef.get();
        
        if (!moduloDoc.exists) {
          return res.status(404).json({ erro: 'Módulo não encontrado' });
        }
      } else {
        moduloRef = cursoRef.collection('modulos').doc();
        await moduloRef.set({
          titulo: titulo || 'Novo Módulo',
          ordem: 1,
          dataCriacao: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      const conteudoRef = moduloRef.collection('conteudos').doc();
      
      await conteudoRef.set({
        titulo: titulo || arquivo.originalname,
        tipo: tipoArquivo || (arquivo.mimetype.includes('video') ? 'video' : 'documento'),
        url: urlArquivo,
        dataCriacao: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(201).json({
        mensagem: 'Arquivo enviado com sucesso',
        url: urlArquivo,
        moduloId: moduloRef.id,
        conteudoId: conteudoRef.id
      });
    });
    
    stream.end(arquivo.buffer);
  } catch (erro) {
    console.error('Erro ao processar upload:', erro);
    res.status(500).json({ erro: 'Erro ao processar upload' });
  }
});

router.post('/:cursoId/quizzes', verificaJwt, verificaProfessor, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const { titulo, perguntas } = req.body;
    
    if (!titulo || !perguntas || !Array.isArray(perguntas) || perguntas.length === 0) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }
    
    const cursoRef = db.collection('cursos').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    
    if (!cursoDoc.exists) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    
    if (cursoDoc.data().professorId !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para adicionar quiz a este curso' });
    }
    
    const quizRef = db.collection('quizzes').doc();
    
    await quizRef.set({
      cursoId,
      titulo,
      perguntas,
      dataCriacao: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      id: quizRef.id,
      mensagem: 'Quiz criado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao criar quiz:', erro);
    res.status(500).json({ erro: 'Erro ao criar quiz' });
  }
});

router.post('/:cursoId/quizzes/:quizId/responder', verificaJwt, async (req, res) => {
  try {
    const { cursoId, quizId } = req.params;
    const { respostas } = req.body;
    
    if (!respostas || !Array.isArray(respostas)) {
      return res.status(400).json({ erro: 'Respostas não fornecidas' });
    }
    
    const quizRef = db.collection('quizzes').doc(quizId);
    const quizDoc = await quizRef.get();
    
    if (!quizDoc.exists) {
      return res.status(404).json({ erro: 'Quiz não encontrado' });
    }
    
    const quiz = quizDoc.data();
    
    if (quiz.cursoId !== cursoId) {
      return res.status(400).json({ erro: 'Quiz não pertence ao curso especificado' });
    }
    
    const perguntas = quiz.perguntas;
    let pontuacao = 0;
    const feedback = [];
    
    respostas.forEach((resposta, index) => {
      if (index < perguntas.length) {
        const pergunta = perguntas[index];
        const respostaCorreta = pergunta.respostaCorreta;
        
        const acertou = resposta === respostaCorreta;
        
        if (acertou) {
          pontuacao++;
        }
        
        feedback.push({
          pergunta: pergunta.texto,
          respostaUsuario: resposta,
          respostaCorreta,
          acertou
        });
      }
    });
    
    const percentualAcerto = (pontuacao / perguntas.length) * 100;
    
    const resultadoRef = db.collection('resultadosQuiz').doc();
    
    await resultadoRef.set({
      quizId,
      cursoId,
      usuarioId: req.usuarioId,
      respostas,
      pontuacao,
      percentualAcerto,
      dataEnvio: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).json({
      id: resultadoRef.id,
      pontuacao,
      percentualAcerto,
      feedback,
      mensagem: 'Respostas enviadas com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao processar respostas do quiz:', erro);
    res.status(500).json({ erro: 'Erro ao processar respostas' });
  }
});

module.exports = router;