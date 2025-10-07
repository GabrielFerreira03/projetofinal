// Versão simplificada para teste da aplicação Angular
console.log('EduNext - Carregando aplicação...');

// Simulação básica de componentes Angular
function EduNextApp() {
    this.init = function() {
        console.log('Inicializando EduNext...');
        this.setupNavigation();
        this.loadInitialPage();
        // Inicializar tema após carregar a página
        setTimeout(() => {
            this.initializeTheme();
        }, 100);
    };

    // Sistema básico de autenticação
    this.isAuthenticated = function() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        return !!(token && user);
    };

    this.getCurrentUser = function() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    };

    this.login = function(email, password) {
        // Verificar credenciais padrão do admin
        if (email === 'admin@edunext.com' && password === '123456') {
            const user = {
                id: 'admin',
                name: 'Administrador EduNext',
                email: email,
                type: 'admin'
            };
            localStorage.setItem('authToken', 'admin-token-' + Date.now());
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            return true;
        }

        // Verificar usuários registrados
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('authToken', 'user-token-' + Date.now());
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            return true;
        }

        return false;
    };

    this.logout = function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.hash = '#/';
    };

    this.requireAuth = function() {
        if (!this.isAuthenticated()) {
            window.location.hash = '#/login';
            return false;
        }
        return true;
    };

    this.setupNavigation = function() {
        // Configuração básica de navegação
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
    };

    this.handleRouteChange = function() {
        const hash = window.location.hash.slice(1) || '/';
        console.log('Navegando para:', hash);
        
        // Se usuário está logado e tenta acessar página inicial, redireciona para home
        if (hash === '/' && this.isAuthenticated()) {
            window.location.hash = '#/home';
            return;
        }
        
        // Se usuário não está logado e tenta acessar páginas protegidas, redireciona para login
        const protectedRoutes = ['/home', '/dashboard', '/perfil', '/comunidade', '/configuracoes'];
        if (protectedRoutes.includes(hash) && !this.isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }
        
        switch(hash) {
            case '/':
                this.loadLandingPage();
                break;
            case '/home':
                this.loadUserHomePage();
                break;
            case '/login':
                if (this.isAuthenticated()) {
                    window.location.hash = '#/home';
                    return;
                }
                this.loadLoginPage();
                break;
            case '/cadastro':
                this.loadRegisterPage();
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
            case '/termos':
                this.loadTermsPage();
                break;
            default:
                if (this.isAuthenticated()) {
                    this.loadUserHomePage();
                } else {
                    this.loadLandingPage();
                }
        }
    };

    this.loadInitialPage = function() {
        if (this.isAuthenticated()) {
            this.loadUserHomePage();
        } else {
            this.loadLandingPage();
        }
    };

    this.loadLandingPage = function() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadLandingPage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            ${this.isAuthenticated() ? 
                                `<a href="#/home" onclick="app.loadUserHomePage()">Home</a>
                                 <a href="#/dashboard" onclick="app.loadDashboard()">Painel</a>
                                 <button onclick="app.logout()" class="btn-logout">Sair</button>` :
                                `<a href="#/login" onclick="app.loadLoginPage()">Entrar</a>`
                            }
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="hero-section">
                            <h2>Bem-vindo ao EduNext</h2>
                            <p>Plataforma de Ensino Online de Programação</p>
                            <p class="hero-subtitle">Aprenda programação de forma prática, interativa e moderna</p>
                            <button onclick="app.handleStartLearning()" class="btn-primary large">
                                Começar a Aprender
                            </button>
                        </div>
                        
                        <div class="info-section">
                            <div class="info-card interactive-card">
                                <h3>Nossa Missão</h3>
                                <p>Democratizar o ensino de programação através de uma plataforma moderna e acessível, formando desenvolvedores capacitados para o mercado de trabalho.</p>
                            </div>
                            <div class="info-card interactive-card">
                                <h3>Diferenciais da Plataforma</h3>
                                <ul>
                                    <li class="feature-item">Projetos práticos e hands-on</li>
                                    <li class="feature-item">Vídeo-aulas interativas</li>
                                    <li class="feature-item">Aprendizado colaborativo</li>
                                    <li class="feature-item">Comunidade de desenvolvedores</li>
                                    <li class="feature-item">Acesso multiplataforma</li>
                                </ul>
                            </div>
                            <div class="info-card interactive-card">
                                <h3>Nossos Números</h3>
                                <div class="stats">
                                    <div class="stat-item">
                                        <span class="stat-number">1200+</span>
                                        <span class="stat-label">Estudantes</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">25+</span>
                                        <span class="stat-label">Cursos</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">98%</span>
                                        <span class="stat-label">Satisfação</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="cta-section">
                            <h3>🚀 Pronto para programar?</h3>
                            <p>Junte-se à nossa comunidade de desenvolvedores e comece sua jornada na programação hoje!</p>
                            <div class="cta-buttons">
                                <button onclick="app.loadCoursesPage()" class="btn-primary large">🎓 Explorar Cursos</button>
                                ${!this.isAuthenticated() ? 
                                    `<button onclick="app.loadLoginPage()" class="btn-secondary large">Fazer Login</button>` : 
                                    ''
                                }
                            </div>
                        </div>
                    </main>
                    
                    <footer class="main-footer">
                        <div class="footer-content">
                            <div class="footer-section">
                                <h4>EduNext</h4>
                                <p>Plataforma de Ensino Online de Programação</p>
                                <div class="social-links">
                                    <a href="https://www.instagram.com/edunextt/" target="_blank" class="social-link">Instagram</a>
                                    <a href="https://youtu.be/S2A_t_BXbcQ" target="_blank" class="social-link">YouTube</a>
                                </div>
                            </div>
                            <div class="footer-section">
                                <h4>Cursos</h4>
                                <ul>
                                    <li><a href="#/cursos">Lógica de Programação</a></li>
                                    <li><a href="#/cursos">HTML & CSS</a></li>
                                    <li><a href="#/cursos">JavaScript</a></li>
                                    <li><a href="#/cursos">Angular</a></li>
                                </ul>
                            </div>
                            <div class="footer-section">
                                <h4>Plataforma</h4>
                                <ul>
                                    <li><a href="#/termos" onclick="app.loadTermsPage()">Termos de Serviço</a></li>
                                    <li><a href="#/termos" onclick="app.loadTermsPage()">Política de Privacidade</a></li>
                                    <li><a href="#/ajuda">Central de Ajuda</a></li>
                                </ul>
                            </div>
                            <div class="footer-section">
                                <h4>Contato</h4>
                                <p>Suporte técnico:</p>
                                <p></p>
                                <p>bancoedunext@gmail.com</p>
                                <p></p>
                                <p>Salvador, Brasil</p>
                                <p></p>
                                <p>Suporte: 9h-18h</p>
                            </div>
                        </div>
                        <div class="footer-bottom">
                            <p>&copy; 2024 EduNext. Promovendo inclusão através da educação. Todos os direitos reservados.</p>
                        </div>
                    </footer>
                </div>
            `;
            
            // Configurar validação da checkbox de forma mais robusta
            const initCheckboxValidation = () => {
                setTimeout(() => {
                    const checkbox = document.getElementById('acceptTerms');
                    const button = document.getElementById('createAccountBtn');
                    
                    if (checkbox && button) {
                        // Estado inicial - botão desabilitado
                        button.disabled = true;
                        button.setAttribute('disabled', 'disabled');
                        
                        // Função para atualizar o estado do botão
                        const updateButtonState = () => {
                            if (checkbox.checked) {
                                button.disabled = false;
                                button.removeAttribute('disabled');
                            } else {
                                button.disabled = true;
                                button.setAttribute('disabled', 'disabled');
                            }
                        };
                        
                        // Múltiplos event listeners para garantir funcionamento
                        checkbox.addEventListener('change', updateButtonState);
                        checkbox.addEventListener('click', () => setTimeout(updateButtonState, 10));
                        checkbox.addEventListener('input', updateButtonState);
                        
                        // Verificação inicial
                        updateButtonState();
                        
                        console.log('Validação da checkbox configurada com sucesso');
                    } else {
                        console.log('Elementos não encontrados, tentando novamente...');
                        setTimeout(initCheckboxValidation, 100);
                    }
                }, 50);
            };
            
            // Inicializar validação
            initCheckboxValidation();
        }
    };

    this.loadUserHomePage = function() {
        // Verificar se o usuário está autenticado
        if (!this.requireAuth()) {
            return;
        }

        const currentUser = this.getCurrentUser();
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container modern-layout">
                    <main class="main-content">
                        <header class="top-header">
                            <div class="header-left">
                                <img src="src/assets/img/logofundoinvisivelazul.png" alt="Logo EduNext" class="header-logo">
                            </div>
                            <div class="header-right">
                                <div class="user-avatar" onclick="app.loadProfile()">
                                    <span>${currentUser.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                        </header>


                        <section class="welcome-section">
                            <div class="welcome-content">
                                <div class="welcome-header">
                                    <h2>Bem-vindo, ${currentUser.name || currentUser.nome || 'Usuário'}!</h2>
                                    <p>Explore nossos cursos e continue sua jornada de aprendizado</p>
                                </div>
                                
                                <div class="dashboard-cards">
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            `;
            
            // Adicionar animações e interatividade
            this.addHomePageInteractions();
        }
    };

    this.addHomePageInteractions = function() {
        // Animação de entrada para os cards
        setTimeout(() => {
            const cards = document.querySelectorAll('.stat-card, .course-card, .activity-item');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.5s ease';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 100);

        // Hover effects para os cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
                this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            });
        });

        // Animação do progresso circular
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            setTimeout(() => {
                progressCircle.style.background = `conic-gradient(#4caf50 0deg 270deg, #f0f0f0 270deg 360deg)`;
            }, 1000);
        }
    };

    this.toggleSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content-area');
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('with-sidebar');
        }
    };

    this.addLoginAnimations = function() {
        // Animação das formas flutuantes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 0.5}s`;
        });

        // Animação dos inputs com floating labels
        const inputs = document.querySelectorAll('.input-container input');
        inputs.forEach(input => {
            const label = input.nextElementSibling;
            const border = input.parentElement.querySelector('.input-border');

            input.addEventListener('focus', () => {
                label.classList.add('active');
                border.classList.add('active');
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
                border.classList.remove('active');
                input.parentElement.classList.remove('focused');
            });

            // Verificar se já tem valor (para credenciais salvas)
            if (input.value) {
                label.classList.add('active');
            }
        });

        // Animação do botão de login
        const loginBtn = document.querySelector('.login-btn-modern');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                if (this.classList.contains('loading')) return;
                
                this.classList.add('loading');
                const btnText = this.querySelector('.btn-text');
                const btnLoader = this.querySelector('.btn-loader');
                
                btnText.style.opacity = '0';
                btnLoader.style.display = 'block';
                
                // Remover loading após um tempo (será removido quando o login for processado)
                setTimeout(() => {
                    this.classList.remove('loading');
                    btnText.style.opacity = '1';
                    btnLoader.style.display = 'none';
                }, 2000);
            });
        }

        // Animação do checkbox customizado
        const checkbox = document.querySelector('#rememberMe');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                const checkmark = this.nextElementSibling;
                if (this.checked) {
                    checkmark.classList.add('checked');
                } else {
                    checkmark.classList.remove('checked');
                }
            });
        }

        // Efeito de hover nos links
        const links = document.querySelectorAll('.forgot-link, .register-link, .back-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });

        // Animação de entrada escalonada
        setTimeout(() => {
            const elements = document.querySelectorAll('.login-header, .form-group-modern, .form-options-modern, .login-btn-modern, .login-divider, .social-login, .login-footer-modern');
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'all 0.5s ease';
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 200);
    };

    this.loadLoginPage = function() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadLandingPage()">Início</a>
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
                                    <div class="form-options">
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="rememberMe"> Lembrar de mim
                                        </label>
                                        <a href="#/esqueci-senha" class="forgot-password">Esqueci minha senha</a>
                                    </div>
                                    <button type="submit" class="login-button">Entrar</button>
                                </form>
                                <div class="login-footer">
                                    <p>Não tem conta? <a href="#/cadastro">Cadastre-se</a></p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
            
            // Carregar credenciais salvas
            setTimeout(() => {
                this.loadSavedCredentials();
            }, 100);
        }
    };

    this.loadRegisterPage = function() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/login" onclick="app.loadLoginPage()">Entrar</a>
                        </div>
                    </nav>
                    <main class="main-content">
                        <div class="login-container">
                            <div class="login-form">
                                <h2>Junte-se ao EduNext</h2>
                                <p class="login-subtitle">Comece sua jornada de aprendizado em Língua Gestual Portuguesa</p>
                                <form onsubmit="app.handleRegister(event)">
                                    <div class="form-group">
                                        <label for="registerName">Nome completo:</label>
                                        <input type="text" id="registerName" required placeholder="Seu nome completo">
                                    </div>
                                    <div class="form-group">
                                        <label for="registerUsername">Nome de usuário:</label>
                                        <input type="text" id="registerUsername" required placeholder="Escolha um nome de usuário">
                                    </div>
                                    <div class="form-group">
                                        <label for="registerBirthdate">Data de nascimento:</label>
                                        <input type="date" id="registerBirthdate" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="registerEmail">Email:</label>
                                        <input type="email" id="registerEmail" required placeholder="seu@email.com">
                                    </div>
                                    <div class="form-group">
                                        <label for="registerPassword">Senha:</label>
                                        <div class="password-input-container">
                                            <input type="password" id="registerPassword" required placeholder="Digite uma senha segura">
                                            <button type="button" class="toggle-password" onclick="app.togglePasswordVisibility('registerPassword')">
                                                👁️
                                            </button>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="confirmPassword">Confirmar senha:</label>
                                        <div class="password-input-container">
                                            <input type="password" id="confirmPassword" required placeholder="Confirme sua senha">
                                            <button type="button" class="toggle-password" onclick="app.togglePasswordVisibility('confirmPassword')">
                                                👁️
                                            </button>
                                        </div>
                                    </div>
                                    <div class="form-options">
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="acceptTerms" required> 
                                            Aceito os <a href="#/termos" onclick="app.loadTermsPage()">Termos de Serviço</a>
                                        </label>
                                    </div>
                                    <div class="form-options">
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="receiveUpdates"> 
                                            Quero receber novidades sobre cursos
                                        </label>
                                    </div>
                                    <button type="submit" id="createAccountBtn" class="login-button" disabled>Criar Conta</button>
                                </form>
                                <div class="login-footer">
                                    <p class="login-link">
                                        Já tem uma conta? <a href="#/login" onclick="app.loadLoginPage()">Faça login aqui</a>
                                    </p>
                                    <p class="terms-link">
                                        Ao criar uma conta, você concorda com nossos 
                                        <a href="#/termos" onclick="app.loadTermsPage()">Termos de Serviço</a> e 
                                        <a href="#/termos#politica-privacidade" onclick="app.loadPrivacyPolicy()">Política de Privacidade</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    };

    this.loadCoursesPage = async function() {
        const appRoot = document.querySelector('app-root');
        const isLoggedIn = this.getCurrentUser() !== null;
        const currentUser = this.getCurrentUser();
        
        if (appRoot) {
            if (isLoggedIn) {
                // Layout com sidebar para usuários logados
                appRoot.innerHTML = `
                    <div class="app-container modern-layout">
                        <aside class="sidebar">
                            <div class="sidebar-header">
                                <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="sidebar-logo">
                                <h2>EduNext</h2>
                            </div>
                            <nav class="sidebar-nav">
                                <a href="#/home" class="nav-item" onclick="app.loadUserHomePage()">
                                    <i class="icon">🏠</i>
                                    <span>Home</span>
                                </a>
                                <a href="#/cursos" class="nav-item active" onclick="app.loadCoursesPage()">
                                    <i class="icon">📚</i>
                                    <span>Cursos</span>
                                </a>
                                <a href="#/configuracoes" class="nav-item" onclick="app.loadSettingsPage()">
                                    <i class="icon">⚙️</i>
                                    <span>Configuração</span>
                                </a>
                            </nav>
                            <div class="sidebar-footer">
                                <a href="#/logout" class="nav-item logout-nav" onclick="app.logout()">
                                    <i class="icon">🚪</i>
                                    <span>Sair</span>
                                </a>
                            </div>
                        </aside>

                        <main class="main-content-area">
                            <header class="top-header">
                                <div class="header-left">
                                    <button class="menu-toggle" onclick="app.toggleSidebar()">☰</button>
                                    <h1>Cursos</h1>
                                </div>
                                <div class="header-right">
                                    <div class="user-avatar" onclick="app.loadProfile()">
                                        <span>${currentUser.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                            </header>

                            <section class="courses-section">
                                <div class="courses-header">
                                    <h2>Biblioteca de Cursos</h2>
                                    <p>Carregando cursos...</p>
                                    <div class="loading-spinner">
                                        <div class="spinner"></div>
                                        <p>Buscando cursos na API...</p>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                `;
            } else {
                // Layout simples para usuários não logados
                appRoot.innerHTML = `
                    <div class="app-container">
                        <nav class="navbar">
                            <div class="nav-brand">
                                <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
                                <h1>EduNext</h1>
                            </div>
                            <div class="nav-links">
                                <a href="#/" onclick="app.loadLandingPage()">Início</a>
                                <a href="#/login" onclick="app.loadLoginPage()">Entrar</a>
                            </div>
                        </nav>
                        <main class="main-content">
                            <div class="courses-container">
                                <h2>Cursos de Língua Gestual Portuguesa</h2>
                                <p>Carregando cursos...</p>
                                <div class="loading-spinner">
                                    <div class="spinner"></div>
                                    <p>Buscando cursos na API...</p>
                                </div>
                            </div>
                        </main>
                    </div>
                `;
            }

            try {
                // Carregar dados da API
                const response = await fetch('http://localhost:3002/api/cursos');
                const data = await response.json();
                let cursos = Array.isArray(data) ? data : (data.cursos || []);

                // Fallback local: se a API retornar vazia, exibir cursos de exemplo
                if (!Array.isArray(cursos) || cursos.length === 0) {
                    cursos = [
                        {
                            id: 'curso-logica',
                            titulo: 'Lógica de Programação',
                            descricao: 'Fundamentos de lógica e pensamento computacional.',
                            categoria: 'Lógica de Programação',
                            nivel: 'basico',
                            duracao: '10h',
                            instrutor: 'Equipe EduNext'
                        },
                        {
                            id: 'curso-html-css',
                            titulo: 'HTML & CSS',
                            descricao: 'Crie páginas web modernas com HTML e CSS.',
                            categoria: 'HTML & CSS',
                            nivel: 'basico',
                            duracao: '12h',
                            instrutor: 'Equipe EduNext'
                        },
                        {
                            id: 'curso-javascript',
                            titulo: 'JavaScript',
                            descricao: 'Programação com JavaScript do básico ao avançado.',
                            categoria: 'JavaScript',
                            nivel: 'intermediario',
                            duracao: '16h',
                            instrutor: 'Equipe EduNext'
                        },
                        {
                            id: 'curso-angular',
                            titulo: 'Angular',
                            descricao: 'Desenvolva aplicações modernas com Angular.',
                            categoria: 'Angular',
                            nivel: 'intermediario',
                            duracao: '20h',
                            instrutor: 'Equipe EduNext'
                        }
                    ];
                }

                if (isLoggedIn) {
                    // Renderizar página com layout sidebar para usuários logados
                    appRoot.innerHTML = `
                        <div class="app-container modern-layout">
                            
                            <aside class="sidebar">
                                <div class="sidebar-header">
                                    <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="sidebar-logo">
                                    <h2>EduNext</h2>
                                </div>
                                <nav class="sidebar-nav">
                                    <a href="#/home" class="nav-item" onclick="app.loadUserHomePage()">
                                        <i class="icon">●</i>
                                        <span>Home</span>
                                    </a>
                                    <a href="#/cursos" class="nav-item active" onclick="app.loadCoursesPage()">
                                        <i class="icon">■</i>
                                        <span>Cursos</span>
                                    </a>
                                </nav>
                                <div class="sidebar-footer">
                                    <button onclick="app.logout()" class="logout-btn">
                                        <i class="icon">→</i>
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </aside>

                            
                            <main class="main-content-area expanded">
                                
                                <header class="top-header">
                                    <div class="header-left">
                                        <button class="menu-toggle" onclick="app.toggleSidebar()">☰</button>
                                        <h1>Meus Cursos</h1>
                                    </div>
                                    <div class="header-right">
                                        <div class="user-avatar" onclick="app.loadProfile()">
                                            <span>${currentUser.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </header>

                                
                                <section class="courses-section">
                                    <div class="courses-header">
                                        <h2>Biblioteca de Cursos</h2>
                                        <p>Explore nossa biblioteca de ${cursos.length} cursos e comece sua jornada de aprendizado hoje!</p>
                                        
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
                                            <button class="btn-secondary" onclick="app.refreshCourses()">Atualizar Cursos</button>
                                        </div>
                                    </div>
                                    
                                    <div class="courses-grid" id="coursesGrid">
                                        ${cursos.map(curso => `
                                            <div class="course-card" data-category="${curso.categoria.toLowerCase()}" data-level="${curso.nivel.toLowerCase()}">
                                                <div class="course-image">${this.getCourseIcon(curso.categoria)}</div>
                                                <h3>${curso.titulo}</h3>
                                                <p>${curso.descricao}</p>
                                                <div class="course-meta">
                                                    <span class="level level-${curso.nivel.toLowerCase()}">${curso.nivel}</span>
                                                    <span class="duration">${curso.duracao}</span>
                                                    <span class="instructor">${curso.instrutor}</span>
                                                </div>
                                                <div class="course-actions">
                                                    <button class="btn-primary" onclick="app.startCourse('${curso.id}')">Começar Curso</button>
                                                    <button class="btn-secondary" onclick="app.viewCourseDetails(event, '${curso.id}')">Ver Detalhes</button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <div class="api-info">
                                        <small>Dados carregados da API em tempo real • Última atualização: ${new Date().toLocaleTimeString()}</small>
                                    </div>
                                </section>
                            </main>
                        </div>
                    `;
                } else {
                    // Renderizar página simples para usuários não logados
                    appRoot.innerHTML = `
                        <div class="app-container">
                            <nav class="navbar">
                                <div class="nav-brand">
                                    <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
                                    <h1>EduNext</h1>
                                </div>
                                <div class="nav-links">
                                    <a href="#/" onclick="app.loadLandingPage()">Início</a>
                                    <a href="#/login" onclick="app.loadLoginPage()">Entrar</a>
                                </div>
                            </nav>
                            <main class="main-content">
                                <div class="courses-container">
                                    <h2>Cursos de Programação</h2>
                                    <p>Explore nossa biblioteca de ${cursos.length} cursos e comece sua jornada de aprendizado hoje!</p>
                                    
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
                                        <button class="btn-secondary" onclick="app.refreshCourses()">Atualizar Cursos</button>
                                    </div>
                                    
                                    <div class="courses-grid" id="coursesGrid">
                                        ${cursos.map(curso => `
                                            <div class="course-card" data-category="${curso.categoria.toLowerCase()}" data-level="${curso.nivel.toLowerCase()}">
                                                <div class="course-image">${this.getCourseIcon(curso.categoria)}</div>
                                                <h3>${curso.titulo}</h3>
                                                <p>${curso.descricao}</p>
                                                <div class="course-meta">
                                                    <span class="level level-${curso.nivel.toLowerCase()}">${curso.nivel}</span>
                                                    <span class="duration">${curso.duracao}</span>
                                                    <span class="instructor">${curso.instrutor}</span>
                                                </div>
                                                <div class="course-actions">
                                                    <button class="btn-primary" onclick="app.startCourse('${curso.id}')">Começar Curso</button>
                                                    <button class="btn-secondary" onclick="app.viewCourseDetails(event, '${curso.id}')">Ver Detalhes</button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <div class="api-info">
                                        <small>Dados carregados da API em tempo real • Última atualização: ${new Date().toLocaleTimeString()}</small>
                                    </div>
                                </div>
                            </main>
                        </div>
                    `;
                }

                // Adicionar event listeners para filtros
                this.setupCourseFilters();

            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
                if (isLoggedIn) {
                    // Layout com sidebar para erro em usuários logados
                    appRoot.innerHTML = `
                        <div class="app-container modern-layout">
                            
                            <aside class="sidebar">
                                <div class="sidebar-header">
                                    <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="sidebar-logo">
                                    <h2>EduNext</h2>
                                </div>
                                <nav class="sidebar-nav">
                                    <a href="#/home" class="nav-item" onclick="app.loadUserHomePage()">
                                        <i class="icon">●</i>
                                        <span>Home</span>
                                    </a>
                                    <a href="#/cursos" class="nav-item active" onclick="app.loadCoursesPage()">
                                        <i class="icon">■</i>
                                        <span>Cursos</span>
                                    </a>
                                </nav>
                                <div class="sidebar-footer">
                                    <button onclick="app.logout()" class="logout-btn">
                                        <i class="icon">→</i>
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </aside>

                            
                            <main class="main-content-area expanded">
                                
                                <header class="top-header">
                                    <div class="header-left">
                                        <button class="menu-toggle" onclick="app.toggleSidebar()">☰</button>
                                        <h1>Meus Cursos</h1>
                                    </div>
                                    <div class="header-right">
                                        <div class="user-avatar" onclick="app.loadProfile()">
                                            <span>${currentUser.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </header>

                                
                                <section class="courses-section">
                                    <div class="courses-header">
                                        <h2>📚 Cursos Disponíveis</h2>
                                        <p>Erro ao carregar cursos da API</p>
                                        <div class="error-message">
                                            <h3>❌ Erro de Conexão</h3>
                                            <p>Não foi possível carregar os cursos. Verifique se a API está funcionando.</p>
                                            <button class="btn-primary" onclick="app.loadCoursesPage()">Tentar Novamente</button>
                                        </div>
                                    </div>
                                </section>
                            </main>
                        </div>
                    `;
                } else {
                    // Layout simples para erro em usuários não logados
                    appRoot.innerHTML = `
                        <div class="app-container">
                            <nav class="navbar">
                                <div class="nav-brand">
                                    <img src="src/assets/img/logofundoinvisivelazul.png" alt="Logo EduNext" class="logo-img">
                                    <h1>EduNext</h1>
                                </div>
                                <div class="nav-links">
                                    <a href="#/" onclick="app.loadLandingPage()">Início</a>
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
    };

    this.getCourseIcon = function(categoria) {
        const icons = {
            'Lógica de Programação': '<img src="src/assets/img/logicapromacao.png" alt="Lógica de Programação" class="course-icon">',
            'HTML & CSS': '<img src="src/assets/img/html.png" alt="HTML & CSS" class="course-icon">',
            'JavaScript': '<img src="src/assets/img/javascript.png" alt="JavaScript" class="course-icon">',
            'Angular': '<img src="src/assets/img/angular.png" alt="Angular" class="course-icon">'
        };
        return icons[categoria] || '<img src="src/assets/img/logoprojetofinal.png" alt="Curso" class="course-icon">';
    };

    this.setupCourseFilters = function() {
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
    };

    this.refreshCourses = async function() {
        await this.loadCoursesPage();
    };

    this.startCourse = function(courseId) {
        if (!this.isAuthenticated()) {
            window.location.hash = '#/login';
            this.loadLoginPage();
            return;
        }
        alert(`Iniciando curso ID: ${courseId}`);
    };

    this.viewCourseDetails = function(event, courseId) {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;

        const courseCard = event?.target?.closest('.course-card') || Array.from(coursesGrid.querySelectorAll('.course-card')).find(card => card.querySelector('.btn-secondary')?.getAttribute('onclick')?.includes(`'${courseId}'`));
        if (!courseCard) return;

        const detailsById = {
            'curso-logica': {
                titulo: 'Lógica de Programação',
                conteudo: [
                    'Conceitos básicos: algoritmos, variáveis, operadores',
                    'Estruturas de controle: if, else, switch',
                    'Estruturas de repetição: for, while',
                    'Introdução a funções e modularização'
                ]
            },
            'curso-html-css': {
                titulo: 'HTML & CSS',
                conteudo: [
                    'HTML semântico e estrutura de páginas',
                    'CSS: seletores, box model e layout',
                    'Flexbox e Grid',
                    'Responsividade e boas práticas'
                ]
            },
            'curso-javascript': {
                titulo: 'JavaScript',
                conteudo: [
                    'Sintaxe e tipos de dados',
                    'Manipulação do DOM',
                    'Eventos e funções',
                    'ES6+ e módulos'
                ]
            },
            'curso-angular': {
                titulo: 'Angular',
                conteudo: [
                    'Componentes e módulos',
                    'Data binding e diretivas',
                    'Serviços e injeção de dependência',
                    'Roteamento e HTTP'
                ]
            }
        };

        const info = detailsById[courseId];
        if (!info) return;

        // Fechar quaisquer painéis de detalhes abertos em outros cards
        coursesGrid.querySelectorAll('.course-details').forEach(el => el.remove());

        const details = document.createElement('div');
        details.className = 'course-details';
        details.innerHTML = `
            <div class="details-content">
                <h4 style="margin:0 0 8px 0; color:#1f2937;">${info.titulo}</h4>
                <ul class="details-list">
                    ${info.conteudo.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="details-actions">
                    <button class="btn-secondary" onclick="this.closest('.course-details').remove()">Fechar</button>
                </div>
            </div>
        `;

        details.style.padding = '12px';
        details.style.border = '1px solid #e0e0e0';
        details.style.borderRadius = '8px';
        details.style.background = '#fafafa';
        details.style.boxSizing = 'border-box';
        details.style.position = 'absolute';
        details.style.left = '12px';
        details.style.right = '12px';
        details.style.top = '12px';
        details.style.bottom = '12px';
        details.style.zIndex = '10';
        details.style.overflowY = 'auto';

        const contentEl = details.querySelector('.details-content');
        contentEl.style.display = 'flex';
        contentEl.style.flexDirection = 'column';
        contentEl.style.alignItems = 'center';
        contentEl.style.textAlign = 'center';
        contentEl.style.gap = '10px';

        const listEl = details.querySelector('.details-list');
        listEl.style.listStyle = 'disc';
        listEl.style.paddingLeft = '18px';
        listEl.style.display = 'inline-block';
        listEl.style.textAlign = 'left';

        const actionsEl = details.querySelector('.details-actions');
        actionsEl.style.display = 'flex';
        actionsEl.style.justifyContent = 'center';
        actionsEl.style.marginTop = '12px';

        courseCard.appendChild(details);
        courseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    this.handleStartLearning = function() {
        if (this.isAuthenticated()) {
            // Se usuário está logado, vai para cursos
            this.loadCoursesPage();
        } else {
            // Se usuário não está logado, vai para cadastro
            this.loadRegisterPage();
        }
    };

    this.generateStandardHeader = function() {
        return `
            <nav class="navbar">
                <div class="nav-brand">
                    <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
                    <h1>EduNext</h1>
                    <button class="theme-toggle" onclick="app.toggleTheme()" title="Alternar tema">
                        <span class="theme-icon">🌙</span>
                    </button>
                </div>
                <div class="nav-links">
                    <a href="#/dashboard" onclick="app.loadDashboard()">Dashboard</a>
                    <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                    <a href="#/perfil" onclick="app.loadProfile()">Meu Perfil</a>
                </div>
                <div class="nav-actions">
                    <button class="logout-btn" onclick="app.logout()" title="Sair">
                        <span>Sair</span>
                    </button>
                </div>
            </nav>
        `;
    };

    this.toggleTheme = function() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    };

    this.initializeTheme = function() {
        const savedTheme = localStorage.getItem('theme');
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    };

    this.handleLogin = function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        console.log('Tentativa de login:', { email, password, rememberMe });
        
        if (this.login(email, password)) {
            // Salvar credenciais se solicitado
            if (rememberMe) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('rememberLogin', 'true');
                console.log('Credenciais salvas no localStorage:', { email, rememberMe: true });
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('rememberLogin');
                console.log('Credenciais removidas do localStorage');
            }
            
            alert('Login realizado com sucesso! Bem-vindo ao EduNext!');
            window.location.hash = '#/home';
        } else {
            alert('Email ou senha inválidos. Verifique suas credenciais e tente novamente.');
        }
    };

    this.togglePasswordVisibility = function(inputId) {
        const passwordInput = document.getElementById(inputId);
        const toggleButton = passwordInput.parentElement.querySelector('.toggle-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = '🙈';
            toggleButton.setAttribute('aria-label', 'Ocultar senha');
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = '👁️';
            toggleButton.setAttribute('aria-label', 'Mostrar senha');
        }
    };

    this.loadSavedCredentials = function() {
        const savedEmail = localStorage.getItem('savedEmail');
        const rememberLogin = localStorage.getItem('rememberLogin');
        
        console.log('Carregando credenciais salvas:', { savedEmail, rememberLogin });
        
        // Sempre garantir que a checkbox inicie desmarcada
        const rememberCheckbox = document.getElementById('rememberMe');
        if (rememberCheckbox) {
            rememberCheckbox.checked = false;
        }
        
        // Só preencher o email e marcar a checkbox se houver credenciais salvas
        if (savedEmail && rememberLogin === 'true') {
            const emailInput = document.getElementById('email');
            
            console.log('Elementos encontrados:', { emailInput, rememberCheckbox });
            
            if (emailInput) {
                emailInput.value = savedEmail;
                console.log('Email preenchido:', savedEmail);
            }
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
                console.log('Checkbox marcada - credenciais encontradas');
            }
        } else {
            console.log('Nenhuma credencial salva encontrada - checkbox desmarcada');
        }
    };

    // Função de teste para verificar a funcionalidade de salvar senha
    this.testSavePassword = function() {
        console.log('=== TESTE DA FUNCIONALIDADE SALVAR SENHA ===');
        
        // Verificar se os elementos existem
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        console.log('Elementos na página:', {
            emailInput: emailInput ? 'Encontrado' : 'Não encontrado',
            rememberCheckbox: rememberCheckbox ? 'Encontrado' : 'Não encontrado'
        });
        
        // Verificar localStorage atual
        const savedEmail = localStorage.getItem('savedEmail');
        const rememberLogin = localStorage.getItem('rememberLogin');
        
        console.log('Estado atual do localStorage:', {
            savedEmail,
            rememberLogin
        });
        
        // Simular salvamento
        if (emailInput && rememberCheckbox) {
            emailInput.value = 'teste@exemplo.com';
            rememberCheckbox.checked = true;
            
            localStorage.setItem('savedEmail', 'teste@exemplo.com');
            localStorage.setItem('rememberLogin', 'true');
            
            console.log('Teste de salvamento realizado');
            
            // Testar carregamento
            setTimeout(() => {
                this.loadSavedCredentials();
            }, 100);
        }
        
        console.log('=== FIM DO TESTE ===');
    };

    this.handleRegister = function(event) {
        event.preventDefault();
        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const birthdate = document.getElementById('registerBirthdate').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        const receiveUpdates = document.getElementById('receiveUpdates').checked;

        // Validações
        if (password !== confirmPassword) {
            alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!acceptTerms) {
            alert('Você deve aceitar os Termos de Serviço para criar uma conta.');
            return;
        }

        // Verificar se o email ou nome de usuário já existem (simulação)
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (existingUsers.find(user => user.email === email)) {
            alert('Este email já está cadastrado. Tente fazer login ou use outro email.');
            return;
        }
        
        if (existingUsers.find(user => user.username === username)) {
            alert('Este nome de usuário já está em uso. Escolha outro nome de usuário.');
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            name: name,
            username: username,
            birthdate: birthdate,
            email: email,
            password: password, // Em produção, isso seria hasheado
            createdAt: new Date().toISOString(),
            receiveUpdates: receiveUpdates
        };

        // Salvar usuário
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        alert(`Conta criada com sucesso! Bem-vindo ao EduNext, ${name}!`);
        
        // Fazer login automático
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        window.location.hash = '#/dashboard';
    };

    this.showCourseDetails = function(courseId) {
        alert(`Detalhes do curso ${courseId} em desenvolvimento!`);
    };

    this.loadDashboard = function() {
        // Verificar se o usuário está autenticado
        if (!this.requireAuth()) {
            return;
        }

        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    ${this.generateStandardHeader()}
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
    };

    this.loadProfile = function() {
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
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="header-logo">
                            <span class="menu-title">EduNext</span>
                        </div>
                    </nav>

                    
                    <main class="main-content">

                        
                        <section class="profile-section">
                            <div class="profile-content">
                                <div class="profile-info">
                                    <div class="user-avatar profile-avatar">
                                        <span>${currentUser.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <h2>${currentUser.name}</h2>
                                    ${currentUser.username ? `<p class="username">@${currentUser.username}</p>` : ''}
                                    ${currentUser.birthdate ? `<p>Data de nascimento: ${new Date(currentUser.birthdate).toLocaleDateString('pt-BR')}</p>` : ''}
                                    <p>${currentUser.type === 'student' ? 'Estudante' : currentUser.type === 'teacher' ? 'Professor' : 'Administrador'}</p>
                                    <p>Email: ${currentUser.email}</p>
                                    <p>Membro desde: ${new Date(currentUser.createdAt).toLocaleDateString('pt-BR')}</p>
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
                        </section>
                    </main>
                </div>
            `;
        }
    };

    this.loadTermsPage = function() {
        const appRoot = document.querySelector('app-root');
        const isLoggedIn = this.getCurrentUser() !== null;
        
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    ${isLoggedIn ? this.generateStandardHeader() : `
                    <nav class="navbar">
                        <div class="nav-brand">
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
                            <h1>EduNext</h1>
                        </div>
                        <div class="nav-links">
                            <a href="#/" onclick="app.loadHomePage()">Início</a>
                            <a href="#/cursos" onclick="app.loadCoursesPage()">Cursos</a>
                            <a href="#/login" onclick="app.loadLoginPage()">Login</a>
                        </div>
                    </nav>`}
                    <main class="main-content">
                        <div class="terms-container">
                            <h1>Termos de Serviço - EduNext</h1>
                            <div class="terms-content">
                                <section class="terms-section">
                                    <h2>1. Aceitação dos Termos</h2>
                                    <p>Ao acessar e usar a plataforma EduNext, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.</p>
                                </section>

                                <section class="terms-section">
                                    <h2>2. Descrição do Serviço</h2>
                                    <p>O EduNext é uma plataforma de ensino online especializada em cursos de programação. Oferecemos:</p>
                                    <ul>
                                        <li>Cursos de Lógica de Programação</li>
                                        <li>Cursos de HTML & CSS</li>
                                        <li>Cursos de JavaScript</li>
                                        <li>Cursos de Angular</li>
                                        <li>Projetos práticos e hands-on</li>
                                        <li>Comunidade de desenvolvedores</li>
                                        <li>Ferramentas de acompanhamento de progresso</li>
                                    </ul>
                                </section>

                                <section class="terms-section">
                                    <h2>3. Registro e Conta de Usuário</h2>
                                    <p>Para acessar determinados recursos, você deve criar uma conta fornecendo informações precisas e atualizadas. Você é responsável por:</p>
                                    <ul>
                                        <li>Manter a confidencialidade de sua senha</li>
                                        <li>Todas as atividades que ocorrem em sua conta</li>
                                        <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                                    </ul>
                                </section>

                                <section class="terms-section">
                                    <h2>4. Uso Aceitável</h2>
                                    <p>Você concorda em usar a plataforma apenas para fins legais e de acordo com estes termos. É proibido:</p>
                                    <ul>
                                        <li>Violar direitos de propriedade intelectual</li>
                                        <li>Transmitir conteúdo ofensivo ou prejudicial</li>
                                        <li>Interferir no funcionamento da plataforma</li>
                                        <li>Usar a plataforma para atividades comerciais não autorizadas</li>
                                    </ul>
                                </section>

                                <section class="terms-section">
                                    <h2>5. Propriedade Intelectual</h2>
                                    <p>Todo o conteúdo da plataforma, incluindo textos, vídeos, imagens e materiais de programação, é protegido por direitos autorais e outras leis de propriedade intelectual.</p>
                                </section>

                                <section class="terms-section">
                                    <h2>6. Privacidade</h2>
                                    <p>Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para entender como coletamos, usamos e protegemos suas informações pessoais.</p>
                                </section>

                                <section class="terms-section">
                                    <h2>7. Modificações dos Termos</h2>
                                    <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma.</p>
                                </section>

                                <section class="terms-section" id="politica-privacidade">
                                    <h2>8. Política de Privacidade</h2>
                                    <p>Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais na plataforma EduNext.</p>
                                    
                                    <h3>8.1. Informações que Coletamos</h3>
                                    <p>Coletamos as seguintes informações:</p>
                                    <ul>
                                        <li>Informações de cadastro (nome, email, senha)</li>
                                        <li>Dados de progresso nos cursos</li>
                                        <li>Informações de uso da plataforma</li>
                                        <li>Dados de comunicação conosco</li>
                                    </ul>
                                    
                                    <h3>8.2. Como Usamos suas Informações</h3>
                                    <p>Utilizamos suas informações para:</p>
                                    <ul>
                                        <li>Fornecer e melhorar nossos serviços</li>
                                        <li>Personalizar sua experiência de aprendizado</li>
                                        <li>Comunicar atualizações e novidades</li>
                                        <li>Garantir a segurança da plataforma</li>
                                    </ul>
                                    
                                    <h3>8.3. Proteção de Dados</h3>
                                    <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
                                    
                                    <h3>8.4. Seus Direitos</h3>
                                    <p>Você tem o direito de:</p>
                                    <ul>
                                        <li>Acessar suas informações pessoais</li>
                                        <li>Corrigir dados incorretos</li>
                                        <li>Solicitar a exclusão de seus dados</li>
                                        <li>Retirar o consentimento a qualquer momento</li>
                                    </ul>
                                    
                                    <h3>8.5. Contato sobre Privacidade</h3>
                                    <p>Para questões sobre privacidade, entre em contato: contato@edunext.pt</p>
                                </section>

                                <section class="terms-section">
                                    <h2>9. Contato</h2>
                                    <p>Para questões sobre estes Termos de Serviço, entre em contato conosco:</p>
                                    <ul>
                                        <li>Email: contato@edunext.pt</li>
                                        <li>Suporte técnico: bancoedunext@gmail.com</li>
                                        <li>Endereço: Lisboa, Portugal - Salvador, Brasil</li>
                                    </ul>
                                </section>

                                <div class="terms-footer">
                                    <p><strong>Última atualização:</strong> Janeiro de 2024</p>
                                    <div class="terms-actions">
                                        <button onclick="window.print()" class="btn-secondary">Imprimir</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            `;
        }
    };

    this.loadPrivacyPolicy = function() {
        // Carrega a página de termos primeiro
        this.loadTermsPage();
        // Aguarda um pouco para a página carregar e então rola para a seção de privacidade
        setTimeout(() => {
            const privacySection = document.getElementById('politica-privacidade');
            if (privacySection) {
                privacySection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    this.loadCommunity = function() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
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
    };

    this.loadSettings = function() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
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
    };

    this.loadHelp = function() {
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="app-container">
                    <nav class="navbar">
                        <div class="nav-brand">
                            <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="logo-img">
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
    };

// Adicionar estilos básicos
const styles = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
        }
        
        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 100vw;
            margin: 0;
            padding: 0;
        }
        
        .navbar {
            background: #3f51b5;
            color: white;
            padding: 1.2rem 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo-img {
            height: 40px;
            width: auto;
        }
        
        .nav-brand h1 {
            font-size: 1.5rem;
            margin: 0;
        }
        
        .nav-links {
            display: flex;
            gap: 1.5rem;
            align-items: center;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            padding: 0.7rem 1.2rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .nav-links a:hover {
            background: rgba(255,255,255,0.1);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .theme-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
            margin-left: 1rem;
        }

        .theme-toggle:hover {
            background: rgba(255,255,255,0.1);
            transform: scale(1.1);
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.7rem 1.2rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: #c82333;
            transform: translateY(-1px);
        }
        
        .main-content {
            flex: 1;
            padding: 2rem 1.5rem;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }
        
        .hero-section {
            text-align: center;
            padding: 4rem 20px;
            background: linear-gradient(135deg, #3f51b5 0%, #303f9f 100%);
            color: white;
            border-radius: 15px;
            margin: 0 0 3rem 0;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .hero-section h2 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            font-weight: 700;
            line-height: 1.2;
        }
        
        .hero-section p {
            font-size: 1.4rem;
            margin-bottom: 2.5rem;
            max-width: 600px;
            line-height: 1.6;
            opacity: 0.95;
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
            margin: 3rem auto;
            max-width: 100%;
            padding: 0;
        }
        
        .feature-card {
            background: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
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
            border: 2px solid #3f51b5;
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
        
        .login-button:disabled {
            background: #cccccc;
            color: #666666;
            cursor: not-allowed;
        }
        
        .login-button:disabled:hover {
            background: #cccccc;
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
            min-height: 260px;
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
            background: #e2e8f0;
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
        
        .course-icon {
            width: 60px;
            height: 60px;
            object-fit: contain;
            border-radius: 4px;
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

        .btn-primary.large, .btn-secondary.large {
            padding: 15px 30px;
            font-size: 16px;
            margin: 10px;
        }

        /* Homepage Styles */
        .hero-subtitle {
            font-size: 18px;
            color: white;
            margin-bottom: 30px;
        }

        .info-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 50px 0;
            padding: 0 20px;
        }

        .info-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .interactive-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .info-card h3 {
            color: #3f51b5;
            margin-bottom: 20px;
            font-size: 24px;
        }

        .info-card ul {
            list-style: none;
            padding: 0;
        }

        .info-card li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .info-card li:last-child {
            border-bottom: none;
        }

        .feature-item {
            color: #666;
            text-decoration: none;
            transition: color 0.3s ease;
            cursor: pointer;
        }

        .feature-item:hover {
            color: #3f51b5;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 20px;
            padding: 0 10px;
            align-items: stretch;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px 10px;
            border-radius: 8px;
            background: rgba(63, 81, 181, 0.05);
            transition: transform 0.2s ease;
            min-height: 100px;
        }

        .stat-item:hover {
            transform: translateY(-2px);
            background: rgba(63, 81, 181, 0.1);
        }

        .stat-number {
            display: block;
            font-size: 28px;
            font-weight: bold;
            color: #3f51b5;
            margin-bottom: 8px;
            line-height: 1;
        }

        .stat-label {
            font-size: 13px;
            color: #666;
            font-weight: 500;
            line-height: 1.2;
            margin: 0;
        }

        @media (max-width: 768px) {
            .stats {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .stat-number {
                font-size: 24px;
            }
            
            .stat-label {
                font-size: 12px;
            }
        }

        .cta-section {
            background: linear-gradient(135deg, #3f51b5, #303f9f);
            color: white;
            text-align: center;
            padding: 60px 20px;
            margin: 50px 0;
            border-radius: 15px;
        }

        .cta-section h3 {
            font-size: 32px;
            margin-bottom: 15px;
        }

        .cta-section p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        .cta-buttons {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        /* Footer Styles */
        .main-footer {
            background: #2c3e50;
            color: white;
            padding: 50px 0 20px;
            margin-top: 50px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .footer-section h4 {
            color: #3f51b5;
            margin-bottom: 20px;
            font-size: 20px;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
        }

        .footer-section li {
            margin-bottom: 10px;
        }

        .footer-section a {
            color: #bdc3c7;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-section a:hover {
            color: #3f51b5;
        }

        .social-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
            align-items: center;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            background: #34495e;
            border-radius: 5px;
            text-decoration: none;
            color: white !important;
            font-size: 14px;
            white-space: nowrap;
            min-width: 80px;
            text-align: center;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: #3f51b5 !important;
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(63, 81, 181, 0.3);
        }

        .footer-bottom {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #34495e;
            color: #bdc3c7;
        }

        /* Terms Page Styles */
        .terms-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .terms-container h1 {
            color: #3f51b5;
            text-align: center;
            margin-bottom: 40px;
            font-size: 32px;
        }

        .terms-content {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .terms-section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }

        .terms-section:last-of-type {
            border-bottom: none;
        }

        .terms-section h2 {
            color: #3f51b5;
            margin-bottom: 15px;
            font-size: 24px;
        }

        .terms-section p {
            line-height: 1.6;
            margin-bottom: 15px;
            color: #333;
        }

        .terms-section ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }

        .terms-section li {
            margin-bottom: 8px;
            line-height: 1.6;
        }

        .terms-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #3f51b5;
            text-align: center;
        }

        .terms-actions {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 15px;
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

        /* Login Page Enhancements */
        .login-subtitle {
            color: #666;
            font-size: 16px;
            margin-bottom: 25px;
            text-align: center;
        }

        .password-input-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        .password-input-container input {
            flex: 1;
            padding-right: 45px;
        }

        .toggle-password {
            position: absolute;
            right: 10px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            padding: 5px;
            color: #666;
            transition: color 0.3s ease;
        }

        .toggle-password:hover {
            color: #007bff;
        }

        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            font-size: 14px;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: #555;
        }

        .checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
        }

        .forgot-password {
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
        }

        .forgot-password:hover {
            text-decoration: underline;
        }

        .login-footer {
            text-align: center;
            margin-top: 25px;
        }

        .login-footer p {
            margin: 10px 0;
            font-size: 14px;
            color: #666;
        }

        .terms-link {
            font-size: 12px !important;
            color: #888 !important;
        }

        .terms-link a {
            color: #007bff;
            text-decoration: none;
        }

        .terms-link a:hover {
            text-decoration: underline;
        }

        /* Modern Home Page Styles */
        .home-container {
            display: flex;
            min-height: 100vh;
            background: #f8fafc;
        }

        .sidebar {
            width: 280px;
            background: #ffffff;
            backdrop-filter: blur(10px);
            box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 9999;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            transform: translateX(-100%);
        }

        .sidebar.open {
            transform: translateX(0);
        }



        .sidebar-header {
            padding: 20px 20px;
            text-align: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            flex-shrink: 0;
        }

        .sidebar-header h2 {
            color: #333;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar-nav {
            padding: 10px 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            min-height: 0;
        }

        .sidebar-nav a {
            display: flex;
            align-items: center;
            padding: 12px 25px;
            color: #555;
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }

        .sidebar-nav a:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border-left-color: #667eea;
            transform: translateX(5px);
        }

        .sidebar-nav a.active {
            background: rgba(102, 126, 234, 0.15);
            color: #667eea;
            border-left-color: #667eea;
            font-weight: 600;
        }

        .sidebar-nav a i {
            margin-right: 12px;
            font-size: 18px;
            width: 20px;
            text-align: center;
            transition: margin-right 0.3s ease;
        }

        .sidebar-nav a span {
            transition: opacity 0.3s ease, visibility 0.3s ease;
            opacity: 1;
            visibility: visible;
        }

        .sidebar-footer {
            padding: 10px 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            margin-top: auto;
        }

        .sidebar-footer a.logout-nav {
            color: #dc3545;
            display: flex;
            align-items: center;
            padding: 12px 25px;
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }

        .sidebar-footer a.logout-nav:hover {
            background: rgba(220, 53, 69, 0.1);
            border-left-color: #dc3545;
            transform: translateX(5px);
        }

        .sidebar-footer a.logout-nav i {
            margin-right: 12px;
            font-size: 18px;
            width: 20px;
            text-align: center;
            transition: margin-right 0.3s ease;
        }

        .sidebar-footer a.logout-nav span {
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .logout-btn {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 15px 20px;
            background: none;
            border: none;
            color: #dc3545;
            text-decoration: none;
            transition: all 0.3s ease;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }

        .logout-btn:hover {
            background: rgba(220, 53, 69, 0.1);
            transform: translateX(5px);
        }

        .logout-btn i {
            margin-right: 12px;
            font-size: 18px;
            width: 20px;
            text-align: center;
            transition: margin-right 0.3s ease;
        }

        .logout-btn span {
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .main-content-area {
            flex: 1;
            margin-left: 0;
            transition: margin-left 0.3s ease;
            min-height: 100vh;
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            background: transparent;
        }

        .main-content-area {
            transition: margin-left 0.3s ease, width 0.3s ease;
        }

        .main-content-area.with-sidebar {
            margin-left: 280px;
            width: calc(100% - 280px);
        }

        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                z-index: 1000;
                height: 100vh;
                top: 0;
                left: 0;
            }
            
            .main-content-area.with-sidebar {
                margin-left: 0;
                width: 100%;
            }
            
            .sidebar.open + .main-content-area::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
            }
        }

        .top-header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px 40px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .header-logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }

        .menu-toggle {
            background: none;
            border: none;
            font-size: 24px;
            color: #667eea;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background 0.3s ease;
        }

        .menu-toggle:hover {
            background: rgba(102, 126, 234, 0.1);
        }

        .welcome-text h1 {
            margin: 0;
            color: #333;
            font-size: 28px;
            font-weight: 700;
        }

        .welcome-text p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 16px;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .notification-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: #667eea;
            cursor: pointer;
            padding: 10px;
            border-radius: 50%;
            transition: all 0.3s ease;
            position: relative;
        }

        .notification-btn:hover {
            background: rgba(102, 126, 234, 0.1);
            transform: scale(1.1);
        }

        .notification-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .user-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: #6b7280;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .user-avatar:hover {
            transform: scale(1.1);
        }

        .search-box {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 25px;
            padding: 8px 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            max-width: 300px;
        }

        .search-box:focus-within {
            background: white;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }

        .search-input {
            border: none;
            background: transparent;
            outline: none;
            padding: 8px 12px;
            font-size: 14px;
            color: #333;
            flex: 1;
            min-width: 0;
        }

        .search-input::placeholder {
            color: #999;
        }

        .welcome-section {
            padding: 40px;
            flex: 1;
        }

        .welcome-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .welcome-header h2 {
            color: #333;
            font-size: 32px;
            margin-bottom: 10px;
        }

        .welcome-header p {
            color: #666;
            font-size: 18px;
        }

        .dashboard-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .dashboard-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dashboard-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .dashboard-card h3 {
            color: #333;
            font-size: 24px;
            margin-bottom: 15px;
        }

        .dashboard-card p {
            color: #666;
            font-size: 16px;
            margin-bottom: 25px;
            line-height: 1.5;
        }

        .card-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .card-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .search-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .search-btn:hover {
            background: #2563eb;
            transform: scale(1.05);
        }

        .home-content {
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
        }

        .stat-icon.courses {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .stat-icon.progress {
            background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .stat-icon.time {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
        }

        .stat-icon.achievements {
            background: linear-gradient(135deg, #43e97b, #38f9d7);
        }

        .stat-number {
            font-size: 36px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .stat-label {
            color: #666;
            font-size: 16px;
            font-weight: 500;
        }

        .quick-actions {
            margin-bottom: 40px;
        }

        .section-title {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 25px;
            text-align: center;
        }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .action-btn {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: none;
            padding: 25px;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .action-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            background: white;
        }

        .action-icon {
            font-size: 32px;
            color: #667eea;
        }

        .action-text {
            font-weight: 600;
            font-size: 16px;
        }

        .content-sections {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .content-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .content-card h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 700;
        }

        .activity-item, .course-item {
            padding: 15px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .activity-item:last-child, .course-item:last-child {
            border-bottom: none;
        }

        .activity-icon, .course-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: white;
            background: transparent;
        }

        .activity-info, .course-info {
            flex: 1;
        }

        .activity-title, .course-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }

        .activity-time, .course-progress {
            font-size: 14px;
            color: #666;
        }

        .course-progress-bar {
            width: 100%;
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            margin-top: 8px;
            overflow: hidden;
        }

        .course-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
            border-radius: 3px;
            transition: width 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .content-sections {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                width: 100%;
                transform: translateX(-100%);
            }

            .sidebar.open {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0 !important;
                width: 100% !important;
            }

            .top-header {
                padding: 15px 20px;
            }

            .welcome-text h1 {
                font-size: 24px;
            }

            .home-content {
                padding: 20px;
            }

            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }

            .actions-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
        }

        /* Animation Classes */
        .fade-in {
            animation: fadeIn 0.6s ease-out;
        }

        .slide-up {
            animation: slideUp 0.6s ease-out;
        }

        .scale-in {
            animation: scaleIn 0.4s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes scaleIn {
             from {
                 opacity: 0;
                 transform: scale(0.9);
             }
             to {
                 opacity: 1;
                 transform: scale(1);
             }
         }

         /* Modern Login Page Styles */
         .modern-login-container {
             min-height: 100vh;
             display: flex;
             align-items: center;
             justify-content: center;
             position: relative;
             overflow: hidden;
         }

         .login-background {
             position: absolute;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
             z-index: 1;
         }

         .floating-shapes {
             position: absolute;
             width: 100%;
             height: 100%;
             overflow: hidden;
         }

         .shape {
             position: absolute;
             border-radius: 50%;
             background: rgba(255, 255, 255, 0.1);
             animation: float 6s ease-in-out infinite;
         }

         .shape-1 {
             width: 80px;
             height: 80px;
             top: 20%;
             left: 10%;
             animation-delay: 0s;
         }

         .shape-2 {
             width: 120px;
             height: 120px;
             top: 60%;
             right: 10%;
             animation-delay: 2s;
         }

         .shape-3 {
             width: 60px;
             height: 60px;
             bottom: 20%;
             left: 20%;
             animation-delay: 4s;
         }

         .shape-4 {
             width: 100px;
             height: 100px;
             top: 10%;
             right: 30%;
             animation-delay: 1s;
         }

         @keyframes float {
             0%, 100% {
                 transform: translateY(0px) rotate(0deg);
                 opacity: 0.7;
             }
             50% {
                 transform: translateY(-20px) rotate(180deg);
                 opacity: 1;
             }
         }

         .login-content {
             position: relative;
             z-index: 2;
             width: 100%;
             max-width: 450px;
             padding: 20px;
         }

         .login-card {
             background: rgba(255, 255, 255, 0.95);
             backdrop-filter: blur(20px);
             border-radius: 24px;
             padding: 40px;
             box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
             border: 1px solid rgba(255, 255, 255, 0.2);
             position: relative;
             overflow: hidden;
         }

         .login-card::before {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             height: 1px;
             background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
         }

         .login-header {
             text-align: center;
             margin-bottom: 40px;
         }

         .logo-container {
             margin-bottom: 20px;
         }

         .login-logo {
             width: 60px;
             height: 60px;
             border-radius: 50%;
             box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
         }

         .login-title {
             font-size: 28px;
             font-weight: 700;
             color: #333;
             margin: 20px 0 10px 0;
             background: linear-gradient(135deg, #3b82f6, #1d4ed8);
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
         }

         .login-subtitle {
             color: #666;
             font-size: 16px;
             line-height: 1.5;
             margin: 0;
         }

         .login-form-modern {
             margin-bottom: 30px;
         }

         .form-group-modern {
             margin-bottom: 25px;
         }

         .input-container {
             position: relative;
         }

         .input-container input {
             width: 100%;
             padding: 16px 20px;
             border: 2px solid #e1e5e9;
             border-radius: 12px;
             font-size: 16px;
             background: rgba(255, 255, 255, 0.8);
             transition: all 0.3s ease;
             outline: none;
         }

         .input-container input:focus {
             border-color: #667eea;
             background: rgba(255, 255, 255, 0.95);
             transform: translateY(-2px);
             box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
         }

         .floating-label {
             position: absolute;
             left: 20px;
             top: 50%;
             transform: translateY(-50%);
             color: #999;
             font-size: 16px;
             pointer-events: none;
             transition: all 0.3s ease;
             background: rgba(255, 255, 255, 0.9);
             padding: 0 8px;
             border-radius: 4px;
         }

         .floating-label.active {
             top: 0;
             font-size: 14px;
             color: #667eea;
             font-weight: 600;
         }

         .input-border {
             position: absolute;
             bottom: 0;
             left: 50%;
             width: 0;
             height: 2px;
             background: linear-gradient(90deg, #3b82f6, #1d4ed8);
             transition: all 0.3s ease;
             transform: translateX(-50%);
         }

         .input-border.active {
             width: 100%;
         }

         .toggle-password-modern {
             position: absolute;
             right: 15px;
             top: 50%;
             transform: translateY(-50%);
             background: none;
             border: none;
             font-size: 18px;
             cursor: pointer;
             color: #999;
             transition: all 0.3s ease;
             padding: 5px;
             border-radius: 50%;
         }

         .toggle-password-modern:hover {
             color: #667eea;
             background: rgba(102, 126, 234, 0.1);
         }

         .form-options-modern {
             display: flex;
             justify-content: space-between;
             align-items: center;
             margin-bottom: 30px;
         }

         .checkbox-modern {
             display: flex;
             align-items: center;
             cursor: pointer;
             position: relative;
         }

         .checkbox-modern input[type="checkbox"] {
             display: none;
         }

         .checkmark {
             width: 20px;
             height: 20px;
             border: 2px solid #ddd;
             border-radius: 4px;
             margin-right: 10px;
             position: relative;
             transition: all 0.3s ease;
             background: white;
         }

         .checkmark::after {
             content: '✓';
             position: absolute;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%) scale(0);
             color: white;
             font-size: 12px;
             font-weight: bold;
             transition: transform 0.2s ease;
         }

         .checkmark.checked {
             background: linear-gradient(135deg, #3b82f6, #1d4ed8);
             border-color: #3b82f6;
         }

         .checkmark.checked::after {
             transform: translate(-50%, -50%) scale(1);
         }

         .checkbox-text {
             color: #555;
             font-size: 14px;
             user-select: none;
         }

         .forgot-link {
             color: #667eea;
             text-decoration: none;
             font-size: 14px;
             font-weight: 500;
             transition: all 0.3s ease;
         }

         .forgot-link:hover {
             color: #764ba2;
             text-decoration: underline;
         }

         .login-btn-modern {
             width: 100%;
             padding: 16px;
             background: linear-gradient(135deg, #667eea, #764ba2);
             color: white;
             border: none;
             border-radius: 12px;
             font-size: 16px;
             font-weight: 600;
             cursor: pointer;
             transition: all 0.3s ease;
             position: relative;
             overflow: hidden;
             margin-bottom: 25px;
         }

         .login-btn-modern:hover {
             transform: translateY(-2px);
             box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
         }

         .login-btn-modern:active {
             transform: translateY(0);
         }

         .login-btn-modern.loading {
             pointer-events: none;
         }

         .btn-loader {
             display: none;
             width: 20px;
             height: 20px;
             border: 2px solid rgba(255, 255, 255, 0.3);
             border-top: 2px solid white;
             border-radius: 50%;
             animation: spin 1s linear infinite;
             margin: 0 auto;
         }

         .login-divider {
             text-align: center;
             margin: 25px 0;
             position: relative;
         }

         .login-divider::before {
             content: '';
             position: absolute;
             top: 50%;
             left: 0;
             right: 0;
             height: 1px;
             background: #e1e5e9;
         }

         .login-divider span {
             background: rgba(255, 255, 255, 0.95);
             padding: 0 20px;
             color: #999;
             font-size: 14px;
         }

         .social-login {
             margin-bottom: 25px;
         }

         .social-btn {
             width: 100%;
             padding: 14px;
             border: 2px solid #e1e5e9;
             border-radius: 12px;
             background: rgba(255, 255, 255, 0.8);
             color: #555;
             font-size: 15px;
             font-weight: 500;
             cursor: pointer;
             transition: all 0.3s ease;
             display: flex;
             align-items: center;
             justify-content: center;
             gap: 10px;
         }

         .social-btn:hover {
             border-color: #667eea;
             background: rgba(255, 255, 255, 0.95);
             transform: translateY(-1px);
             box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
         }

         .login-footer-modern {
             text-align: center;
         }

         .login-footer-modern p {
             margin: 0 0 15px 0;
             color: #666;
             font-size: 14px;
         }

         .register-link {
             color: #667eea;
             text-decoration: none;
             font-weight: 600;
             transition: all 0.3s ease;
         }

         .register-link:hover {
             color: #764ba2;
             text-decoration: underline;
         }

         .back-home {
             margin-top: 15px;
         }

         .back-link {
             color: #999;
             text-decoration: none;
             font-size: 13px;
             transition: all 0.3s ease;
         }

         .back-link:hover {
             color: #667eea;
         }

         /* Responsive Design for Login */
         @media (max-width: 768px) {
             .login-content {
                 max-width: 100%;
                 padding: 15px;
             }

             .login-card {
                 padding: 30px 25px;
                 border-radius: 20px;
             }

             .login-title {
                 font-size: 24px;
             }

             .login-subtitle {
                 font-size: 14px;
             }

             .form-options-modern {
                 flex-direction: column;
                 gap: 15px;
                 align-items: flex-start;
             }
         }

         @media (max-width: 480px) {
             .login-card {
                 padding: 25px 20px;
                 margin: 10px;
             }

             .shape {
                 display: none;
             }
         }

         /* Dark Theme Styles */
         body.dark-theme {
             background-color: #1a1a1a;
             color: #e0e0e0;
         }

         body.dark-theme .navbar {
             background: linear-gradient(135deg, #2c3e50, #34495e);
         }

         body.dark-theme .main-content {
             background-color: #1a1a1a;
         }

         body.dark-theme .dashboard-card,
         body.dark-theme .profile-info,
         body.dark-theme .profile-stats,
         body.dark-theme .course-card {
             background-color: #2d2d2d;
             border: 1px solid #404040;
             color: #e0e0e0;
         }

         body.dark-theme .login-card,
         body.dark-theme .register-card {
             background-color: #2d2d2d;
             border: 1px solid #404040;
         }

         body.dark-theme .form-group input,
         body.dark-theme .form-group textarea {
             background-color: #404040;
             border: 1px solid #555;
             color: #e0e0e0;
         }

         body.dark-theme .form-group input:focus,
         body.dark-theme .form-group textarea:focus {
             border-color: #667eea;
             background-color: #4a4a4a;
         }

         body.dark-theme .btn-primary {
             background: linear-gradient(135deg, #667eea, #764ba2);
         }

         body.dark-theme .btn-secondary {
             background-color: #555;
             color: #e0e0e0;
         }

         body.dark-theme .btn-secondary:hover {
             background-color: #666;
         }

         body.dark-theme .hero-section {
             background: linear-gradient(135deg, #2c3e50, #34495e);
         }

         body.dark-theme .features-grid .feature-card {
             background-color: #2d2d2d;
             border: 1px solid #404040;
         }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', styles);

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.app = new EduNextApp();
    window.app.init();
});
    // Garantir que métodos sejam atribuídos após a criação da instância
    if (window.app) {
        window.app.loadSettingsPage = function() {
            const isLoggedIn = this.isLoggedIn();
            if (!isLoggedIn) {
                this.loadLandingPage();
                return;
            }
            const currentUser = this.getCurrentUser();
            const appRoot = document.querySelector('app-root');
            if (appRoot) {
                appRoot.innerHTML = `
            <div class="app-container modern-layout">
                
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <img src="src/assets/img/logofundoinvisivel.png" alt="Logo EduNext" class="sidebar-logo">
                        <h2>EduNext</h2>
                    </div>
                    <nav class="sidebar-nav">
                         <a href="#/home" class="nav-item" onclick="app.loadUserHomePage()">
                             <i class="icon">🏠</i>
                             <span>Home</span>
                         </a>
                         <a href="#/cursos" class="nav-item" onclick="app.loadCoursesPage()">
                             <i class="icon">📚</i>
                             <span>Cursos</span>
                         </a>
                         <a href="#/configuracoes" class="nav-item active" onclick="app.loadSettingsPage()">
                             <i class="icon">⚙️</i>
                             <span>Configuração</span>
                         </a>
                     </nav>
                     <div class="sidebar-footer">
                         <a href="#/logout" class="nav-item logout-nav" onclick="app.logout()">
                             <i class="icon">🚪</i>
                             <span>Sair</span>
                         </a>
                     </div>
                </aside>

                
                <main class="main-content-area">
                    
                    <header class="top-header">
                        <div class="header-left">
                            <button class="menu-toggle" onclick="app.toggleSidebar()">☰</button>
                            <h1>Configurações</h1>
                        </div>
                        <div class="header-right">
                            <div class="user-avatar" onclick="app.loadProfile()">
                                ${currentUser.nome ? currentUser.nome.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                    </header>

                    
                    <div class="home-content">
                        <div class="settings-container">
                            <div class="settings-section">
                                <h2>Preferências da Conta</h2>
                                <div class="setting-item">
                                    <label>Tema</label>
                                    <select id="theme-selector">
                                        <option value="light">Claro</option>
                                        <option value="dark">Escuro</option>
                                        <option value="auto">Automático</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>Idioma</label>
                                    <select id="language-selector">
                                        <option value="pt">Português</option>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h2>Notificações</h2>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="email-notifications" checked>
                                        Receber notificações por email
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="course-updates" checked>
                                        Atualizações de cursos
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="marketing-emails">
                                        Emails promocionais
                                    </label>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h2>Privacidade</h2>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="profile-public">
                                        Perfil público
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="show-progress" checked>
                                        Mostrar progresso dos cursos
                                    </label>
                                </div>
                            </div>

                            <div class="settings-actions">
                                <button class="btn-primary" onclick="app.saveSettings()">Salvar Configurações</button>
                                <button class="btn-secondary" onclick="app.resetSettings()">Restaurar Padrões</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

                // Adicionar funcionalidade do menu toggle
                this.addSidebarToggle();
            }
        };
    }

// Função para alternar visibilidade da sidebar
if (window.app) {
    window.app.toggleSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content-area');
        
        console.log('Toggle sidebar called', sidebar, mainContent);
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('with-sidebar');
            console.log('Sidebar classes:', sidebar.className);
            console.log('Main content classes:', mainContent.className);
        }
    };
}

// Função para fechar sidebar
if (window.app) {
    window.app.closeSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content-area');
        
        if (sidebar && mainContent) {
            sidebar.classList.remove('open');
            mainContent.classList.remove('with-sidebar');
        }
    };
}

// Fechar sidebar ao clicar fora dela em dispositivos móveis
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && menuToggle && window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            if (sidebar.classList.contains('open') && window.app) {
                window.app.closeSidebar();
            }
        }
    }
});

    // Funções para os cards do dashboard
    this.goToCourses = function() {
        this.loadCoursesPage();
    };

    this.goToSettings = function() {
        this.loadSettingsPage();
    };

    this.goToProfile = function() {
        this.loadProfile();
    };
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.app = new EduNextApp();
    window.app.init();
});