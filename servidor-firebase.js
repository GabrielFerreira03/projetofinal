const express = require('express');
const cors = require('cors');
const { db, auth } = require('./firebase-config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

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

// Endpoint para usuários (dados estáticos para teste)
app.get('/api/usuarios', (req, res) => {
  try {
    const usuariosExemplo = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@exemplo.com',
        tipo: 'estudante',
        ativo: true,
        dataCadastro: '2024-01-15'
      },
      {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@exemplo.com',
        tipo: 'professor',
        ativo: true,
        dataCadastro: '2024-01-10'
      },
      {
        id: '3',
        nome: 'Pedro Lima',
        email: 'pedro@exemplo.com',
        tipo: 'administrador',
        ativo: true,
        dataCadastro: '2024-01-05'
      }
    ];
    
    res.json({ 
      usuarios: usuariosExemplo,
      total: usuariosExemplo.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post('/api/usuarios', (req, res) => {
  try {
    const novoUsuario = req.body;
    const usuarioComId = {
      id: Date.now().toString(),
      ...novoUsuario,
      dataCadastro: new Date().toISOString(),
      ativo: true
    };
    
    res.status(201).json({ 
      usuario: usuarioComId,
      mensagem: 'Usuário criado com sucesso (simulado)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Endpoint para cursos (dados estáticos para teste)
app.get('/api/cursos', (req, res) => {
  try {
    const cursosExemplo = [
      {
        id: '1',
        titulo: 'Lógica de Programação',
        descricao: 'Fundamentos do pensamento computacional',
        nivel: 'Iniciante',
        duracao: '40 horas',
        instrutor: 'Prof. João Silva',
        categoria: 'Programação',
        ativo: true
      },
      {
        id: '2',
        titulo: 'HTML & CSS',
        descricao: 'Criação de páginas web modernas',
        nivel: 'Iniciante',
        duracao: '30 horas',
        instrutor: 'Prof. Maria Santos',
        categoria: 'Web Development',
        ativo: true
      },
      {
        id: '3',
        titulo: 'JavaScript',
        descricao: 'Programação interativa para web',
        nivel: 'Intermediário',
        duracao: '50 horas',
        instrutor: 'Prof. Pedro Lima',
        categoria: 'JavaScript',
        ativo: true
      },
      {
        id: '4',
        titulo: 'Angular',
        descricao: 'Framework para aplicações web',
        nivel: 'Avançado',
        duracao: '60 horas',
        instrutor: 'Prof. Ana Costa',
        categoria: 'Framework',
        ativo: true
      }
    ];
    res.json({ 
      cursos: cursosExemplo,
      total: cursosExemplo.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Endpoint para autenticação (status)
app.get('/api/auth/status', (req, res) => {
  res.json({
    mensagem: 'Endpoint de autenticação disponível',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Firebase rodando na porta ${PORT}`);
  console.log('Acesse: http://localhost:3000/api/teste');
});
