import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let PaginaInicialComponent = class PaginaInicialComponent {
    constructor(cursoServico, autenticacaoServico, router) {
        this.cursoServico = cursoServico;
        this.autenticacaoServico = autenticacaoServico;
        this.router = router;
        this.cursosDestaque = [];
        this.categorias = [
            {
                nome: 'Lógica de Programação',
                icone: '🧠',
                descricao: 'Fundamentos do pensamento computacional',
                categoria: 'logica-programacao'
            },
            {
                nome: 'HTML, CSS e JavaScript',
                icone: '🌐',
                descricao: 'Tecnologias essenciais para web',
                categoria: 'html-css-javascript'
            },
            {
                nome: 'Angular com TypeScript',
                icone: '⚡',
                descricao: 'Framework moderno para aplicações web',
                categoria: 'angular-typescript'
            },
            {
                nome: 'Versionamento com Git',
                icone: '📝',
                descricao: 'Controle de versão profissional',
                categoria: 'versionamento-git'
            },
            {
                nome: 'Metodologias Ágeis (Scrum)',
                icone: '🚀',
                descricao: 'Gestão ágil de projetos',
                categoria: 'metodologias-ageis'
            },
            {
                nome: 'LGPD',
                icone: '🔒',
                descricao: 'Lei Geral de Proteção de Dados',
                categoria: 'lgpd'
            }
        ];
        this.estatisticas = {
            totalEstudantes: 0,
            totalCursos: 0,
            totalProfessores: 0,
            horasConteudo: 0
        };
        this.depoimentos = [
            {
                nome: 'Maria Silva',
                cargo: 'Desenvolvedora Frontend',
                foto: '👩‍💻',
                texto: 'O EduNext transformou minha carreira! Os cursos são práticos e atualizados.',
                nota: 5
            },
            {
                nome: 'João Santos',
                cargo: 'Scrum Master',
                texto: 'Excelente plataforma para aprender metodologias ágeis. Recomendo!',
                foto: '👨‍💼',
                nota: 5
            },
            {
                nome: 'Ana Costa',
                cargo: 'Estudante de TI',
                texto: 'Consegui meu primeiro emprego após completar os cursos de programação.',
                foto: '👩‍🎓',
                nota: 5
            }
        ];
        this.carregando = true;
        this.erro = '';
    }
    async ngOnInit() {
        await this.carregarDados();
    }
    async carregarDados() {
        try {
            this.carregando = true;
            // Carregar cursos em destaque
            const cursos = await this.cursoServico.obterCursosDestaque();
            this.cursosDestaque = cursos.slice(0, 3); // Mostrar apenas 3 cursos
            // Carregar estatísticas
            this.estatisticas = await this.cursoServico.obterEstatisticasGerais();
        }
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.erro = 'Erro ao carregar informações. Tente novamente mais tarde.';
        }
        finally {
            this.carregando = false;
        }
    }
    navegarParaLogin() {
        this.router.navigate(['/login']);
    }
    navegarParaCadastro() {
        this.router.navigate(['/cadastro']);
    }
    navegarParaCursos() {
        if (this.autenticacaoServico.estaLogado()) {
            this.router.navigate(['/cursos']);
        }
        else {
            this.router.navigate(['/login']);
        }
    }
    navegarParaCategoria(categoria) {
        if (this.autenticacaoServico.estaLogado()) {
            this.router.navigate(['/cursos'], { queryParams: { categoria } });
        }
        else {
            this.router.navigate(['/login']);
        }
    }
    navegarParaCurso(cursoId) {
        if (this.autenticacaoServico.estaLogado()) {
            this.router.navigate(['/curso', cursoId]);
        }
        else {
            this.router.navigate(['/login']);
        }
    }
    get usuarioLogado() {
        return this.autenticacaoServico.estaLogado();
    }
    get nomeUsuario() {
        const usuario = this.autenticacaoServico.obterUsuarioAtual();
        return usuario?.nome || '';
    }
    obterEstrelas(nota) {
        return Array(5).fill('⭐').map((_, i) => i < nota ? '⭐' : '☆');
    }
    formatarNumero(numero) {
        if (numero >= 1000) {
            return (numero / 1000).toFixed(1) + 'k';
        }
        return numero.toString();
    }
    scrollParaSecao(secaoId) {
        const elemento = document.getElementById(secaoId);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth' });
        }
    }
};
PaginaInicialComponent = __decorate([
    Component({
        selector: 'app-pagina-inicial',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './pagina-inicial.component.html',
        styleUrls: ['./pagina-inicial.component.css']
    })
], PaginaInicialComponent);
export { PaginaInicialComponent };
//# sourceMappingURL=pagina-inicial.component.js.map