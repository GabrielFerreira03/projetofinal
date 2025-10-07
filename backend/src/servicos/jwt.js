const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const gerarToken = (usuarioId, perfil) => {
  return jwt.sign({ id: usuarioId, perfil }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (erro) {
    return null;
  }
};

module.exports = { gerarToken, verificarToken };