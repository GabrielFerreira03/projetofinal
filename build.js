const fs = require('fs');
const path = require('path');

console.log('🔨 Preparando build para Firebase...');

// Criar diretório de build se não existir
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Copiar arquivos do frontend
const frontendDir = path.join(__dirname, 'frontend');
const files = ['index.html', 'src/main.js'];

files.forEach(file => {
    const srcPath = path.join(frontendDir, file);
    const destPath = path.join(buildDir, path.basename(file));
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copiado: ${file}`);
    }
});

// Atualizar caminhos no index.html para produção
const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Atualizar caminhos relativos
    indexContent = indexContent.replace('./src/main.js', './main.js');
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Caminhos atualizados no index.html');
}

console.log('🚀 Build concluído! Arquivos prontos em ./build/');