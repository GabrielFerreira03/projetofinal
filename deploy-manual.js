const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('📦 Preparando arquivos para deploy manual no Firebase...');

// Verificar se o diretório build existe
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    console.log('❌ Diretório build não encontrado. Execute: node build.js');
    process.exit(1);
}

// Criar arquivo ZIP para upload manual
const output = fs.createWriteStream('firebase-deploy.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
    console.log('✅ Arquivo firebase-deploy.zip criado (' + archive.pointer() + ' bytes)');
    console.log('');
    console.log('🚀 PRÓXIMOS PASSOS:');
    console.log('1. Acesse: https://console.firebase.google.com');
    console.log('2. Selecione o projeto: edunext-91599');
    console.log('3. Vá em "Hosting" no menu lateral');
    console.log('4. Clique em "Get started" ou "Deploy"');
    console.log('5. Faça upload do arquivo: firebase-deploy.zip');
    console.log('');
    console.log('🌐 Sua aplicação estará disponível em:');
    console.log('   https://edunext-91599.web.app');
});

archive.on('error', function(err) {
    console.error('❌ Erro ao criar ZIP:', err);
});

archive.pipe(output);

// Adicionar arquivos do build ao ZIP
archive.directory(buildDir, false);

archive.finalize();

console.log('⏳ Criando arquivo ZIP...');