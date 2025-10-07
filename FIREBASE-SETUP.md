# Configuracao Firebase - EduPlataforma  
  
## 1. Criar Projeto no Firebase Console  
  
1. Acesse: https://console.firebase.google.com/  
2. Clique em "Criar um projeto"  
3. Digite o nome: "eduplataforma"  
4. Ative o Google Analytics (opcional)  
5. Clique em "Criar projeto"  
  
## 2. Configurar Firestore Database  
  
1. No menu lateral, clique em "Firestore Database"  
2. Clique em "Criar banco de dados"  
3. Escolha "Iniciar no modo de teste"  
4. Selecione uma localizacao (us-central1)  
5. Clique em "Concluir"  
  
## 3. Configurar Autenticacao  
  
1. No menu lateral, clique em "Authentication"  
2. Clique em "Comecar"  
3. V  para a aba "Sign-in method"  
4. Ative "Email/Password"  
  
## 4. Obter Credenciais do Servico  
  
1. Clique na engrenagem > "Configuracoes do projeto"  
2. V  para a aba "Contas de servico"  
3. Clique em "Gerar nova chave privada"  
4. Baixe o arquivo JSON  
5. Copie os valores para o arquivo .env  
  
## 5. Configurar arquivo .env  
  
Edite o arquivo .env com suas credenciais:  
  
FIREBASE_PROJECT_ID=seu-projeto-id  
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."  
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com  
FIREBASE_DATABASE_URL=https://seu-projeto-id.firebaseio.com 
