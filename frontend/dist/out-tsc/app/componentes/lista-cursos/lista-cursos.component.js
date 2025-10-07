import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
let ListaCursosComponent = class ListaCursosComponent {
    constructor(cursoServico, autenticacaoServico, route, router) {
        this.cursoServico = cursoServico;
        this.autenticacaoServico = autenticacaoServico;
        this.route = route;
        this.router = router;
        this.destroy$ = new Subject();
        this.cursos = [];
        this.cursosCarregando = false;
        this.usuarioLogado = null;
        // Filtros
        this.filtros = {};
        this.termoPesquisa = '';
        this.categoriaAtiva = 'todas';
        this.nivelAtivo = 'todos';
        this.ordenacaoAtiva = 'relevancia';
        // Paginação
        this.paginaAtual = 1;
        this.itensPorPagina = 12;
        this.totalItens = 0;
        this.totalPaginas = 0;
        // Categorias de conteúdo formativo
        this.categorias = [
            {
                nome: 'Todas',
                valor: 'todas',
                icone: '📚',
                cor: '#6366f1',
                descricao: 'Todos os cursos disponíveis'
            },
            {
                nome: 'Lógica de Programação',
                valor: 'logica-programacao',
                icone: '🧠',
                cor: '#8b5cf6',
                descricao: 'Fundamentos da programação e algoritmos'
            },
            {
                nome: 'HTML, CSS e JavaScript',
                valor: 'web-basico',
                icone: '🌐',
                cor: '#06b6d4',
                descricao: 'Desenvolvimento web front-end básico'
            },
            {
                nome: 'Angular com TypeScript',
                valor: 'angular',
                icone: '🅰️',
                cor: '#dc2626',
                descricao: 'Framework Angular e TypeScript'
            },
            {
                nome: 'Versionamento com Git',
                valor: 'git',
                icone: '📚',
                cor: '#f59e0b',
                descricao: 'Controle de versão e colaboração'
            },
            {
                nome: 'Metodologias Ágeis (Scrum)',
                valor: 'scrum',
                icone: '⚡',
                cor: '#10b981',
                descricao: 'Gestão ágil de projetos'
            },
            {
                nome: 'LGPD',
                valor: 'lgpd',
                icone: '🔒',
                cor: '#6b7280',
                descricao: 'Lei Geral de Proteção de Dados'
            }
        ];
        this.niveis = [
            { nome: 'Todos os níveis', valor: 'todos' },
            { nome: 'Iniciante', valor: 'iniciante' },
            { nome: 'Intermediário', valor: 'intermediario' },
            { nome: 'Avançado', valor: 'avancado' }
        ];
        this.opcesOrdenacao = [
            { nome: 'Relevância', valor: 'relevancia' },
            { nome: 'Mais recentes', valor: 'data' },
            { nome: 'Mais populares', valor: 'popularidade' },
            { nome: 'Melhor avaliados', valor: 'avaliacao' }
        ];
    }
    ngOnInit() {
        // Observar usuário logado
        this.autenticacaoServico.usuarioLogado$
            .pipe(takeUntil(this.destroy$))
            .subscribe(usuario => {
            this.usuarioLogado = usuario;
        });
        // Observar parâmetros da rota
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
            this.aplicarParametrosRota(params);
            this.carregarCursos();
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    aplicarParametrosRota(params) {
        this.termoPesquisa = params['pesquisa'] || '';
        this.categoriaAtiva = params['categoria'] || 'todas';
        this.nivelAtivo = params['nivel'] || 'todos';
        this.ordenacaoAtiva = params['ordenacao'] || 'relevancia';
        this.paginaAtual = parseInt(params['pagina']) || 1;
        this.atualizarFiltros();
    }
    atualizarFiltros() {
        this.filtros = {
            pesquisa: this.termoPesquisa || undefined,
            categoria: this.categoriaAtiva !== 'todas' ? this.categoriaAtiva : undefined,
            nivel: this.nivelAtivo !== 'todos' ? this.nivelAtivo : undefined,
            ordenacao: this.ordenacaoAtiva,
            pagina: this.paginaAtual,
            limite: this.itensPorPagina
        };
    }
    async carregarCursos() {
        this.cursosCarregando = true;
        try {
            const resultado = await this.cursoServico.obterCursos(this.filtros);
            this.cursos = resultado.cursos;
            this.totalItens = resultado.total;
            this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
        }
        catch (error) {
            console.error('Erro ao carregar cursos:', error);
            this.cursos = [];
            this.totalItens = 0;
            this.totalPaginas = 0;
        }
        finally {
            this.cursosCarregando = false;
        }
    }
    filtrarPorCategoria(categoria) {
        this.categoriaAtiva = categoria;
        this.paginaAtual = 1;
        this.atualizarURL();
    }
    filtrarPorNivel(nivel) {
        this.nivelAtivo = nivel;
        this.paginaAtual = 1;
        this.atualizarURL();
    }
    alterarOrdenacao(ordenacao) {
        this.ordenacaoAtiva = ordenacao;
        this.paginaAtual = 1;
        this.atualizarURL();
    }
    pesquisar() {
        this.paginaAtual = 1;
        this.atualizarURL();
    }
    limparFiltros() {
        this.termoPesquisa = '';
        this.categoriaAtiva = 'todas';
        this.nivelAtivo = 'todos';
        this.ordenacaoAtiva = 'relevancia';
        this.paginaAtual = 1;
        this.atualizarURL();
    }
    irParaPagina(pagina) {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaAtual = pagina;
            this.atualizarURL();
        }
    }
    atualizarURL() {
        const queryParams = {};
        if (this.termoPesquisa)
            queryParams.pesquisa = this.termoPesquisa;
        if (this.categoriaAtiva !== 'todas')
            queryParams.categoria = this.categoriaAtiva;
        if (this.nivelAtivo !== 'todos')
            queryParams.nivel = this.nivelAtivo;
        if (this.ordenacaoAtiva !== 'relevancia')
            queryParams.ordenacao = this.ordenacaoAtiva;
        if (this.paginaAtual > 1)
            queryParams.pagina = this.paginaAtual;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'replace'
        });
    }
    async inscreverNoCurso(curso) {
        if (!this.usuarioLogado) {
            this.router.navigate(['/login'], {
                queryParams: { returnUrl: `/cursos/${curso.id}` }
            });
            return;
        }
        try {
            const resultado = await this.cursoServico.inscreverNoCurso(curso.id);
            if (resultado.sucesso) {
                // Atualizar status do curso
                curso.inscrito = true;
                // Mostrar mensagem de sucesso
                console.log('Inscrição realizada com sucesso!');
            }
            else {
                console.error('Erro na inscrição:', resultado.mensagem);
            }
        }
        catch (error) {
            console.error('Erro ao se inscrever no curso:', error);
        }
    }
    navegarParaCurso(curso) {
        this.router.navigate(['/cursos', curso.id]);
    }
    obterCategoriaInfo(categoria) {
        return this.categorias.find(cat => cat.valor === categoria);
    }
    formatarDuracao(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas > 0) {
            return `${horas}h ${mins > 0 ? mins + 'min' : ''}`;
        }
        return `${mins}min`;
    }
    formatarPreco(preco) {
        if (preco === 0)
            return 'Gratuito';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    }
    obterEstrelas(avaliacao) {
        const estrelas = [];
        const avaliacaoArredondada = Math.round(avaliacao * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            if (i <= avaliacaoArredondada) {
                estrelas.push('★');
            }
            else if (i - 0.5 <= avaliacaoArredondada) {
                estrelas.push('☆');
            }
            else {
                estrelas.push('☆');
            }
        }
        return estrelas;
    }
    obterPaginasVisiveis() {
        const paginas = [];
        const inicio = Math.max(1, this.paginaAtual - 2);
        const fim = Math.min(this.totalPaginas, this.paginaAtual + 2);
        for (let i = inicio; i <= fim; i++) {
            paginas.push(i);
        }
        return paginas;
    }
    onKeydownPesquisa(event) {
        if (event.key === 'Enter') {
            this.pesquisar();
        }
    }
};
ListaCursosComponent = __decorate([
    Component({
        selector: 'app-lista-cursos',
        templateUrl: './lista-cursos.component.html',
        styleUrls: ['./lista-cursos.component.css']
    })
], ListaCursosComponent);
export { ListaCursosComponent };
//# sourceMappingURL=lista-cursos.component.js.map