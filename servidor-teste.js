const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/teste', (req, res) => {
  res.json({
    mensagem: 'API da Plataforma de Ensino Online funcionando!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Acesse: http://localhost:3000/api/teste');
});
