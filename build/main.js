// Versão simplificada para teste da aplicação Angular
console.log('EduNext - Carregando aplicação...');

// Simulação básica de componentes Angular
class EduNextApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Inicializando EduNext...');
        this.setupNavigation();
        this.loadInitialPage();
    }

    // Sistema básico de autenticação
    isAuthenticated() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        return !!(token && user);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    login(email, password) {
        // Simulação básica de login - em produção, isso seria uma chamada à API
        if (email && password) {
            const user = {
                id: 1,
                name: 'Usuário Demo',
                email: email,
                type: 'student'
            };
            localStorage.setItem('authToken', 'demo-token-' + Date.now());
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.hash = '#/login';
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.hash = '#/login';
            return false;
        }
        return true;
    }

    setupNavigation() {
        // Configuração básica de navegação
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        console.log('Navegando para:', hash);
        
        switch(hash) {
            case '/':
                this.loadHomePage();
                break;
            case '/login':
                this.loadLoginPage();
                break;
            case '/cursos':
                this.loadCoursesPage();
                break;
            case '/dashboard':
                this.loadDashboard();
                break;
            case '/perfil':
                this.loadProfile();
                break;
            case '/comunidade':
                this.loadCommunity();
                break;
            case '/configuracoes':
                this.loadSettings();
                break;
            case '/ajuda':
                this.loadHelp();
                break;
            default:
                this.loadHomePage();
        }
    }

    loadInitialPage() {
        this.loadHomePage();
    }

    loadHomePage() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            ${this.isAuthenticated() ? 
                                `<a href="#/dashboard" onclick="app.loadDashboard()">Dashboard</a>
                                 <a href="#/perfil" onclick="app.loadProfile()">Perfil</a>
                                 <button onclick="app.logout()" class="btn-logout">Sair</button>` :
                                `<a href="#/login" onclick="app.loadLoginPage()">Login</a>`
                            }
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="hero-section">
                            <h2>Bem-vindo ao EduNext</h2>
                            <p>Plataforma educacional moderna para estudantes e professores</p>
                            <button onclick="app.loadCoursesPage()" class="cta-button">
                                Ver Cursos
                            </button>
                        </div>
                        <div class="features-section">
                            <div class="feature-card">
                                <h3>📚 Cursos Online</h3>
                                <p>Acesse uma variedade de cursos interativos</p>
                                <button onclick="window.location.hash = '#/cursos'" class="btn-primary">Ver Cursos</button>
                            </div>
                            <div class="feature-card">
                                <h3>👥 Comunidade</h3>
                                <p>Conecte-se com outros estudantes</p>
                                <button onclick="window.location.hash = '#/comunidade'" class="btn-primary">Acessar</button>
                            </div>
                            <div class="feature-card">
                                <h3>📊 Progresso</h3>
                                <p>Acompanhe seu desenvolvimento</p>
                                <button onclick="window.location.hash = '#/dashboard'" class="btn-primary">Dashboard</button>
                            </div>
                        </div>
                        <div class="quick-actions">
                            <h3>Ações Rápidas</h3>
                            <button onclick="window.location.hash = '#/perfil'" class="btn-secondary">Meu Perfil</button>
                            <button onclick="window.location.hash = '#/configuracoes'" class="btn-secondary">Configurações</button>
                            <button onclick="window.location.hash = '#/ajuda'" class="btn-secondary">Ajuda</button>
                        </div>
                    </main>
                </div>
            `;
        }
    }

    loadLoginPage() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="login-container">
                            <div class="login-form">
                                <h2>Entrar no EduNext</h2>
                                <form onsubmit="app.handleLogin(event)">
                                    <div class="form-group">
                                        <label for="email">Email:</label>
                                        <input type="email" id="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Senha:</label>
                                        <input type="password" id="password" required>
                                    </div>
                                    <button type="submit" class="login-button">Entrar</button>
                                </form>
                                <p>Não tem conta? <a href="#/cadastro">Cadastre-se</a></p>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    }

    async loadCoursesPage() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            // Mostrar loading
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/login" onclick="app.loadLoginPage()">Login</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="courses-container">
                            <h2>📚 Cursos Disponíveis</h2>
                            <p>Carregando cursos...</p>
                            <div class="loading-spinner">
                                <div class="spinner"></div>
                                <p>Buscando cursos na API...</p>
                            </div>
                        </div>
                    </main>
                </div>
            `;

            try {
                // Carregar dados da API
                const response = await fetch('http://localhost:3000/api/cursos');
                const data = await response.json();
                const cursos = data.cursos || [];

                // Renderizar página com dados reais
                appRoot.innerHTML = `
                    <div class="app-container">
                        <nav class="navbar">
                            <div class="nav-brand">
                                <h1>EduNext</h1>
                            </div>
                            <div class="nav-links">
                                <a href="#/" onclick="app.loadHomePage()">Início</a>
                                <a href="#/login" onclick="app.loadLoginPage()">Login</a>
                            </div>
                        </nav>
                        <main class="main-content">
                            <div class="courses-container">
                                <h2>📚 Cursos Disponíveis</h2>
                                <p>Explore nossa biblioteca de ${cursos.length} cursos e comece a aprender hoje!</p>
                                
                                <div class="filters">
                                    <select class="filter-select" id="categoryFilter">
                                        <option value="">Todas as categorias</option>
                                        ${[...new Set(cursos.map(c => c.categoria))].map(cat => 
                                            `<option value="${cat.toLowerCase()}">${cat}</option>`
                                        ).join('')}
                                    </select>
                                    <select class="filter-select" id="levelFilter">
                                        <option value="">Todos os níveis</option>
                                        ${[...new Set(cursos.map(c => c.nivel))].map(nivel => 
                                            `<option value="${nivel.toLowerCase()}">${nivel}</option>`
                                        ).join('')}
                                    </select>
                                    <button class="btn-secondary" onclick="app.refreshCourses()">🔄 Atualizar</button>
                                </div>
                                
                                <div class="courses-grid" id="coursesGrid">
                                    ${cursos.map(curso => `
                                        <div class="course-card" data-category="${curso.categoria.toLowerCase()}" data-level="${curso.nivel.toLowerCase()}">
                                            <div class="course-image">${this.getCourseIcon(curso.categoria)}</div>
                                            <h3>${curso.titulo}</h3>
                                            <p>${curso.descricao}</p>
                                            <div class="course-meta">
                                                <span class="level level-${curso.nivel.toLowerCase()}">${curso.nivel}</span>
                                                <span class="duration">⏱️ ${curso.duracao}</span>
                                                <span class="instructor">👨‍🏫 ${curso.instrutor}</span>
                                            </div>
                                            <div class="course-actions">
                                                <button class="btn-primary" onclick="app.startCourse('${curso.id}')">Começar Curso</button>
                                                <button class="btn-secondary" onclick="app.viewCourseDetails('${curso.id}')">Ver Detalhes</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="api-info">
                                    <small>📡 Dados carregados da API em tempo real • Última atualização: ${new Date().toLocaleTimeString()}</small>
                                </div>
                            </div>
                        </main>
                    </div>
                `;

                // Adicionar event listeners para filtros
                this.setupCourseFilters();

            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
                appRoot.innerHTML = `
                    <div class="app-container">
                        <nav class="navbar">
                            <div class="nav-brand">
                                <h1>EduNext</h1>
                            </div>
                            <div class="nav-links">
                                <a href="#/" onclick="app.loadHomePage()">Início</a>
                                <a href="#/login" onclick="app.loadLoginPage()">Login</a>
                            </div>
                        </nav>
                        <main class="main-content">
                            <div class="courses-container">
                                <h2>📚 Cursos Disponíveis</h2>
                                <p>Erro ao carregar cursos da API</p>
                                <div class="error-message">
                                    <h3>❌ Erro de Conexão</h3>
                                    <p>Não foi possível carregar os cursos. Verifique se a API está funcionando.</p>
                                    <button class="btn-primary" onclick="app.loadCoursesPage()">Tentar Novamente</button>
                                </div>
                            </div>
                        </main>
                    </div>
                `;
            }
        }
    }

    getCourseIcon(categoria) {
        const icons = {
            'Programação': '💻',
            'Web Development': '🌐',
            'Framework': '⚡',
            'Design': '🎨',
            'Marketing': '📈',
            'Data Science': '📊',
            'Mobile': '📱'
        };
        return icons[categoria] || '📚';
    }

    setupCourseFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const levelFilter = document.getElementById('levelFilter');
        const coursesGrid = document.getElementById('coursesGrid');

        if (categoryFilter && levelFilter && coursesGrid) {
            const filterCourses = () => {
                const selectedCategory = categoryFilter.value;
                const selectedLevel = levelFilter.value;
                const courseCards = coursesGrid.querySelectorAll('.course-card');

                courseCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    const cardLevel = card.dataset.level;
                    
                    const categoryMatch = !selectedCategory || cardCategory === selectedCategory;
                    const levelMatch = !selectedLevel || cardLevel === selectedLevel;
                    
                    if (categoryMatch && levelMatch) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            };

            categoryFilter.addEventListener('change', filterCourses);
            levelFilter.addEventListener('change', filterCourses);
        }
    }

    async refreshCourses() {
        await this.loadCoursesPage();
    }

    startCourse(courseId) {
        alert(`Iniciando curso ID: ${courseId}\n\nEsta funcionalidade será implementada em breve!`);
    }

    viewCourseDetails(courseId) {
        alert(`Visualizando detalhes do curso ID: ${courseId}\n\nEsta funcionalidade será implementada em breve!`);
    }

    handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('Tentativa de login:', { email, password });
        
        if (this.login(email, password)) {
            alert('Login realizado com sucesso!');
            window.location.hash = '#/home';
        } else {
            alert('Email ou senha inválidos. Tente novamente.');
        }
    }

    showCourseDetails(courseId) {
        alert(`Detalhes do curso ${courseId} em desenvolvimento!`);
    }

    loadDashboard() {
        // Verificar se o usuário está autenticado
        if (!this.requireAuth()) {
            return;
        }

        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            <a href="#/perfil" onclick="app.loadProfile()">Perfil</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="dashboard-section">
                            <h1>Dashboard</h1>
                            <div class="dashboard-grid">

                                <div class="dashboard-card">
                                    <h3>📚 Cursos Ativos</h3>
                                    <p class="stat-number">3</p>
                                    <p>cursos em andamento</p>
                                </div>
                                <div class="dashboard-card">
                                    <h3>🏆 Conquistas</h3>
                                    <p class="stat-number">12</p>
                                    <p>badges conquistadas</p>
                                </div>
                                <div class="dashboard-card">
                                    <h3>⏱️ Tempo de Estudo</h3>
                                    <p class="stat-number">24h</p>
                                    <p>esta semana</p>
                                </div>
                            </div>
                            <div class="recent-activity">
                                <h3>Atividade Recente</h3>
                                <ul>
                                    <li>✅ Completou: "Introdução ao JavaScript"</li>
                                    <li>📝 Iniciou: "Funções em JavaScript"</li>
                                    <li>🏆 Conquistou: Badge "Primeiro Código"</li>
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    }

    loadProfile() {
        // Verificar se o usuário está autenticado
        if (!this.requireAuth()) {
            return;
        }

        const currentUser = this.getCurrentUser();
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            <a href="#/dashboard" onclick="app.loadDashboard()">Dashboard</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="profile-section">
                            <h1>Meu Perfil</h1>
                            <div class="profile-content">
                                <div class="profile-info">
                                    <div class="user-avatar profile-avatar">
                                        <span>${currentUser.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <h2>${currentUser.name}</h2>
                                    ${currentUser.username ? `<p class="username">@${currentUser.username}</p>` : ''}
                                    <p>${currentUser.type === 'student' ? 'Estudante' : currentUser.type === 'teacher' ? 'Professor' : 'Administrador'}</p>
                                    <p>Email: ${currentUser.email}</p>
                                    <p>Membro desde: Janeiro 2024</p>
                                </div>
                                <div class="profile-stats">
                                    <h3>Estatísticas</h3>
                                    <div class="stats-grid">
                                        <div class="stat-item">
                                            <span class="stat-label">Cursos Concluídos</span>
                                            <span class="stat-value">5</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Horas de Estudo</span>
                                            <span class="stat-value">120</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Projetos</span>
                                            <span class="stat-value">8</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="profile-actions">
                                    <button class="btn-primary">Editar Perfil</button>
                                    <button class="btn-secondary">Alterar Senha</button>
                                    <button class="btn-danger" onclick="app.logout()">Sair</button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    }

    loadCommunity() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            <a href="#/dashboard" onclick="app.loadDashboard()">Dashboard</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="community-section">
                            <h1>Comunidade</h1>
                            <div class="community-tabs">
                                <button class="tab-button active">Discussões</button>
                                <button class="tab-button">Projetos</button>
                                <button class="tab-button">Eventos</button>
                            </div>
                            <div class="community-content">
                                <div class="discussion-list">
                                    <div class="discussion-item">
                                        <div class="discussion-avatar">👨‍💻</div>
                                        <div class="discussion-content">
                                            <h4>Como otimizar performance em Angular?</h4>
                                            <p>Estou trabalhando em um projeto e gostaria de dicas...</p>
                                            <div class="discussion-meta">
                                                <span>Por: Maria Santos</span>
                                                <span>💬 12 respostas</span>
                                                <span>👍 8 likes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="discussion-item">
                                        <div class="discussion-avatar">👩‍💻</div>
                                        <div class="discussion-content">
                                            <h4>Projeto: Sistema de Biblioteca</h4>
                                            <p>Compartilhando meu projeto final do curso...</p>
                                            <div class="discussion-meta">
                                                <span>Por: Pedro Lima</span>
                                                <span>💬 5 respostas</span>
                                                <span>👍 15 likes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    }

    loadSettings() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            <a href="#/dashboard" onclick="app.loadDashboard()">Dashboard</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="settings-section">
                            <h1>Configurações</h1>
                            <div class="settings-content">
                                <div class="settings-group">
                                    <h3>Preferências de Conta</h3>
                                    <div class="setting-item">
                                        <label>Nome de Usuário</label>
                                        <input type="text" value="joao.silva" class="form-input">
                                    </div>
                                    <div class="setting-item">
                                        <label>Email</label>
                                        <input type="email" value="joao.silva@email.com" class="form-input">
                                    </div>
                                </div>
                                <div class="settings-group">
                                    <h3>Notificações</h3>
                                    <div class="setting-item">
                                        <label class="checkbox-label">
                                            <input type="checkbox" checked> Notificações por email
                                        </label>
                                    </div>
                                    <div class="setting-item">
                                        <label class="checkbox-label">
                                            <input type="checkbox" checked> Notificações push
                                        </label>
                                    </div>
                                </div>
                                <div class="settings-group">
                                    <h3>Aparência</h3>
                                    <div class="setting-item">
                                        <label>Tema</label>
                                        <select class="form-select">
                                            <option>Claro</option>
                                            <option>Escuro</option>
                                            <option>Automático</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="settings-actions">
                                    <button class="btn-primary">Salvar Alterações</button>
                                    <button class="btn-danger">Excluir Conta</button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    }

    loadHelp() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            <a href="#/dashboard" onclick="app.loadDashboard()">Dashboard</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="help-section">
                            <h1>Central de Ajuda</h1>
                            <div class="help-content">
                                <div class="help-search">
                                    <input type="text" placeholder="Pesquisar na ajuda..." class="form-input">
                                    <button class="btn-primary">🔍</button>
                                </div>
                                <div class="help-categories">
                                    <div class="help-category">
                                        <h3>❓ Perguntas Frequentes</h3>
                                        <ul>
                                            <li><a href="#">Como resetar minha senha?</a></li>
                                            <li><a href="#">Como acessar os certificados?</a></li>
                                            <li><a href="#">Como cancelar minha assinatura?</a></li>
                                        </ul>
                                    </div>
                                    <div class="help-category">
                                        <h3>📚 Guias de Uso</h3>
                                        <ul>
                                            <li><a href="#">Primeiros passos na plataforma</a></li>
                                            <li><a href="#">Como navegar pelos cursos</a></li>
                                            <li><a href="#">Usando o sistema de projetos</a></li>
                                        </ul>
                                    </div>
                                    <div class="help-category">
                                        <h3>🛠️ Suporte Técnico</h3>
                                        <ul>
                                            <li><a href="#">Problemas de reprodução de vídeo</a></li>
                                            <li><a href="#">Erro de conexão</a></li>
                                            <li><a href="#">Contatar suporte</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="contact-support">
                                    <h3>Ainda precisa de ajuda?</h3>
                                    <p>Nossa equipe está pronta para ajudar você!</p>
                                    <button class="btn-primary">Contatar Suporte</button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EduNextApp();
});

// Adicionar estilos básicos
const styles = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .navbar {
            background: #3f51b5;
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-brand h1 {
            font-size: 1.5rem;
        }
        
        .nav-links {
            display: flex;
            gap: 1rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background 0.3s;
        }
        
        .nav-links a:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .main-content {
            flex: 1;
            padding: 2rem;
        }
        
        .hero-section {
            text-align: center;
            padding: 4rem 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .hero-section h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .hero-section p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        
        .cta-button {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .cta-button:hover {
            background: #ff5252;
        }
        
        .features-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .feature-card h3 {
            margin-bottom: 1rem;
            color: #3f51b5;
        }
        
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
        }
        
        .login-form {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .login-form h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #3f51b5;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .login-button {
            width: 100%;
            background: #3f51b5;
            color: white;
            border: none;
            padding: 0.75rem;
            font-size: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .login-button:hover {
            background: #303f9f;
        }
        
        .courses-container h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #3f51b5;
        }
        
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
            margin-top: 30px;
        }
        
        .course-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
            position: relative;
            overflow: hidden;
            text-align: center;
        }
        
        .course-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }
        
        .course-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        .course-image {
            font-size: 48px;
            text-align: center;
            margin-bottom: 16px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 8px;
        }
        
        .course-card h3 {
            margin-bottom: 1rem;
            color: #3f51b5;
        }
        
        .course-card p {
            margin-bottom: 1rem;
            color: #666;
        }
        
        .course-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 16px 0;
            align-items: center;
            justify-content: center;
        }
        
        .course-meta span {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .level {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .level-iniciante {
            background: #e8f5e8;
            color: #2e7d32;
        }
        
        .level-intermediário {
            background: #fff3e0;
            color: #f57c00;
        }
        
        .level-avançado {
            background: #fce4ec;
            color: #c2185b;
        }
        
        .duration {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .instructor {
            background: #e0f2f1;
            color: #00695c;
        }
        
        .course-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        
        .course-actions button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filters {
            display: flex;
            gap: 16px;
            margin: 24px 0;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .filter-select {
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
            font-size: 14px;
            min-width: 180px;
            transition: border-color 0.3s ease;
        }
        
        .filter-select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .loading-spinner {
            text-align: center;
            padding: 60px 20px;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-message {
            text-align: center;
            padding: 40px 20px;
            background: #fff5f5;
            border: 2px solid #fed7d7;
            border-radius: 12px;
            margin: 20px 0;
        }
        
        .error-message h3 {
            color: #e53e3e;
            margin-bottom: 16px;
        }
        
        .error-message p {
            color: #718096;
            margin-bottom: 24px;
        }
        
        .api-info {
            text-align: center;
            margin-top: 40px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .api-info small {
            color: #6c757d;
            font-size: 13px;
        }
        
        .course-level {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .course-card button {
            background: #3f51b5;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .course-card button:hover {
            background: #303f9f;
        }

        /* Dashboard Styles */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .dashboard-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            margin: 10px 0;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            transition: width 0.3s ease;
        }

        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #3f51b5;
            margin: 10px 0;
        }

        .recent-activity {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .recent-activity ul {
            list-style: none;
            padding: 0;
        }

        .recent-activity li {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        /* Profile Styles */
        .profile-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 20px;
        }

        .profile-info {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }

        .avatar {
            font-size: 4em;
            margin-bottom: 20px;
        }

        .profile-avatar {
            width: 80px !important;
            height: 80px !important;
            font-size: 32px !important;
            margin: 0 auto 20px auto;
        }

        .username {
            color: #667eea;
            font-weight: 500;
            font-style: italic;
            margin: 5px 0;
        }

        .profile-stats {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-grid {
            display: grid;
            gap: 15px;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .stat-label {
            color: #666;
        }

        .stat-value {
            font-weight: bold;
            color: #3f51b5;
        }

        .profile-actions {
            grid-column: 1 / -1;
            text-align: center;
            margin-top: 20px;
        }

        /* Community Styles */
        .community-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tab-button {
            padding: 10px 20px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .tab-button.active {
            background: #3f51b5;
            color: white;
            border-color: #3f51b5;
        }

        .discussion-list {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .discussion-item {
            display: flex;
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
        }

        .discussion-avatar {
            font-size: 2em;
            margin-right: 15px;
        }

        .discussion-content h4 {
            margin: 0 0 10px 0;
            color: #333;
        }

        .discussion-meta {
            display: flex;
            gap: 15px;
            font-size: 0.9em;
            color: #666;
            margin-top: 10px;
        }

        /* Settings Styles */
        .settings-content {
            max-width: 600px;
        }

        .settings-group {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }

        .setting-item {
            margin-bottom: 15px;
        }

        .setting-item label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
        }

        .form-input, .form-select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .checkbox-label {
            display: flex !important;
            align-items: center;
            gap: 10px;
        }

        .checkbox-label input {
            width: auto !important;
        }

        .settings-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .btn-danger {
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .btn-danger:hover {
            background: #d32f2f;
        }

        /* Help Styles */
        .help-search {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        .help-search input {
            flex: 1;
        }

        .help-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .help-category {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .help-category ul {
            list-style: none;
            padding: 0;
        }

        .help-category li {
            margin-bottom: 10px;
        }

        .help-category a {
            color: #3f51b5;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .help-category a:hover {
            color: #1976d2;
            text-decoration: underline;
        }

        .contact-support {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }

        /* Quick Actions */
        .quick-actions {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 30px;
            text-align: center;
        }

        .quick-actions h3 {
            margin-bottom: 20px;
            color: #333;
        }

        .btn-primary {
            background: #3f51b5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 5px;
            transition: background 0.3s ease;
        }

        .btn-primary:hover {
            background: #303f9f;
        }

        .btn-logout {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
            transition: background 0.3s ease;
            font-size: 14px;
        }

        .btn-logout:hover {
            background: #c82333;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 5px;
            transition: background 0.3s ease;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .profile-content {
                grid-template-columns: 1fr;
            }
            
            .help-categories {
                grid-template-columns: 1fr;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .settings-actions {
                flex-direction: column;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', styles);