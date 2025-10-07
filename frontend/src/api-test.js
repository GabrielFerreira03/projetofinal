// Teste de conectividade com API
class APITester {
    constructor() {
        this.baseURL = 'http://localhost:3002';
        this.results = [];
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/api/teste`);
            const data = await response.json();
            return {
                success: true,
                status: response.status,
                data: data,
                message: 'Conexão com API estabelecida com sucesso!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Falha na conexão com a API'
            };
        }
    }

    async testCourses() {
        try {
            const response = await fetch(`${this.baseURL}/api/cursos`);
            const data = await response.json();
            return {
                success: true,
                status: response.status,
                data: data,
                message: `${data.cursos ? data.cursos.length : 0} cursos encontrados`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Falha ao buscar cursos'
            };
        }
    }

    async testUsers() {
        try {
            const response = await fetch(`${this.baseURL}/api/usuarios`);
            const data = await response.json();
            return {
                success: true,
                status: response.status,
                data: data,
                message: 'Endpoint de usuários funcionando'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Falha ao acessar endpoint de usuários'
            };
        }
    }

    async testAuth() {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/status`);
            const data = await response.json();
            return {
                success: true,
                status: response.status,
                data: data,
                message: 'Status de autenticação verificado'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Endpoint de autenticação não disponível'
            };
        }
    }

    async runAllTests() {
        this.results = [];
        
        console.log('Iniciando testes de API...');
        
        // Teste de conexão
        const connectionTest = await this.testConnection();
        this.results.push({ test: 'Conexão Básica', ...connectionTest });
        
        // Teste de cursos
        const coursesTest = await this.testCourses();
        this.results.push({ test: 'Endpoint Cursos', ...coursesTest });
        
        // Teste de usuários
        const usersTest = await this.testUsers();
        this.results.push({ test: 'Endpoint Usuários', ...usersTest });
        
        // Teste de autenticação
        const authTest = await this.testAuth();
        this.results.push({ test: 'Endpoint Autenticação', ...authTest });
        
        this.displayResults();
        return this.results;
    }

    displayResults() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        let html = '<h2 style="color: #333; margin-bottom: 20px;">🔍 Resultados dos Testes de API</h2>';
        
        const successCount = this.results.filter(r => r.success).length;
        const totalTests = this.results.length;
        
        html += `<div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <strong>Resumo:</strong> ${successCount}/${totalTests} testes passaram
            <div style="background: #ddd; height: 10px; border-radius: 5px; margin-top: 10px;">
                <div style="background: #4CAF50; height: 100%; width: ${(successCount/totalTests)*100}%; border-radius: 5px;"></div>
            </div>
        </div>`;
        
        this.results.forEach(result => {
            const status = result.success ? '✅' : '❌';
            
            html += `
                <div style="margin: 15px 0; padding: 15px; border-left: 4px solid ${result.success ? '#4CAF50' : '#f44336'}; background: ${result.success ? '#f8fff8' : '#fff8f8'}; border-radius: 0 8px 8px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${status} ${result.test}</h3>
                    <p style="margin: 5px 0;"><strong>Status HTTP:</strong> ${result.status || 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Resultado:</strong> ${result.message}</p>
                    ${result.error ? `<p style="color: #f44336; margin: 5px 0;"><strong>Erro:</strong> ${result.error}</p>` : ''}
                    ${result.data ? `<details style="margin-top: 10px;"><summary style="cursor: pointer; font-weight: bold;">📋 Ver dados retornados</summary><pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; margin-top: 10px; font-size: 12px;">${JSON.stringify(result.data, null, 2)}</pre></details>` : ''}
                </div>
            `;
        });

        html += '<button onclick="this.parentElement.parentElement.remove()" style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-top: 20px; font-weight: bold;">Fechar</button>';
        
        content.innerHTML = html;
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // Método para integrar dados de cursos na aplicação
    async loadCoursesData() {
        try {
            const response = await fetch(`${this.baseURL}/api/cursos`);
            const data = await response.json();
            return data.cursos || [];
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
            return [];
        }
    }
}

// Criar instância global
window.apiTester = new APITester();

// Removido botão de teste de APIs conforme solicitação do cliente.