const admin = require('firebase-admin');
require('dotenv').config();

// Configuração simplificada para evitar problemas com as credenciais
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
