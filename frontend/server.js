const express = require('express');
const path = require('path');
const app = express();
const PORT = 4200;

// Servir arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Rota principal retorna o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`);
});