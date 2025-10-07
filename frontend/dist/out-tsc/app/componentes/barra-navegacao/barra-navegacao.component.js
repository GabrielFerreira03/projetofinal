import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
let BarraNavegacaoComponent = class BarraNavegacaoComponent {
    constructor(autenticacaoServico, cursoServico, router) {
        this.autenticacaoServico = autenticacaoServico;
        this.cursoServico = cursoServico;
        this.router = router;
        this.destroy$ = new Subject();
        this.usuarioLogado = null;
        this.menuMobileAberto = false;
        this.menuUsuarioAberto = false;
        this.menuCategoriasAberto = false;
        this.termoPesquisa = '';
        // Categorias de conteúdo
        this.categorias = [
            { nome: 'Lógica de Programação', valor: 'logica-programacao', icone: '🧠' },
            { nome: 'HTML, CSS e JavaScript', valor: 'web-basico', icone: '🌐' },
            { nome: 'Angular com TypeScript', valor: 'angular', icone: '🅰️' },
            { nome: 'Versionamento com Git', valor: 'git', icone: '📚' },
            { nome: 'Metodologias Ágeis (Scrum)', valor: 'scrum', icone: '⚡' },
            { nome: 'LGPD', valor: 'lgpd', icone: '🔒' }
        ];
        // Links de navegação baseados no tipo de usuário
        this.linksNavegacao = [];
    }
    ngOnInit() {
        this.autenticacaoServico.usuarioLogado$
            .pipe(takeUntil(this.destroy$))
            .subscribe(usuario => {
            this.usuarioLogado = usuario;
            this.configurarLinksNavegacao();
        });
        // Fechar menus ao clicar fora
        document.addEventListener('click', this.fecharMenusAoClicarFora.bind(this));
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        document.removeEventListener('click', this.fecharMenusAoClicarFora.bind(this));
    }
    configurarLinksNavegacao() {
        this.linksNavegacao = [
            { nome: 'Início', rota: '/', icone: '🏠' }
        ];
        if (this.usuarioLogado) {
            switch (this.usuarioLogado.tipoUsuario) {
                case 'estudante':
                    this.linksNavegacao.push({ nome: 'Meus Cursos', rota: '/estudante/cursos', icone: '📚' }, { nome: 'Certificados', rota: '/estudante/certificados', icone: '🏆' }, { nome: 'Progresso', rota: '/estudante/progresso', icone: '📊' });
                    break;
                case 'professor':
                    this.linksNavegacao.push({ nome: 'Painel Professor', rota: '/professor/painel', icone: '👨‍🏫' }, { nome: 'Meus Cursos', rota: '/professor/cursos', icone: '📚' }, { nome: 'Criar Curso', rota: '/professor/criar-curso', icone: '➕' }, { nome: 'Estatísticas', rota: '/professor/estatisticas', icone: '📈' });
                    break;
                case 'administrador':
                    this.linksNavegacao.push({ nome: 'Dashboard Admin', rota: '/admin/dashboard', icone: '⚙️' }, { nome: 'Usuários', rota: '/admin/usuarios', icone: '👥' }, { nome: 'Cursos', rota: '/admin/cursos', icone: '📚' }, { nome: 'Relatórios', rota: '/admin/relatorios', icone: '📊' });
                    break;
            }
        }
        else {
            this.linksNavegacao.push({ nome: 'Cursos', rota: '/cursos', icone: '📚' }, { nome: 'Sobre', rota: '/sobre', icone: 'ℹ️' }, { nome: 'Contato', rota: '/contato', icone: '📞' });
        }
    }
    alternarMenuMobile() {
        this.menuMobileAberto = !this.menuMobileAberto;
        this.menuUsuarioAberto = false;
        this.menuCategoriasAberto = false;
    }
    alternarMenuUsuario() {
        this.menuUsuarioAberto = !this.menuUsuarioAberto;
        this.menuMobileAberto = false;
        this.menuCategoriasAberto = false;
    }
    alternarMenuCategorias() {
        this.menuCategoriasAberto = !this.menuCategoriasAberto;
        this.menuMobileAberto = false;
        this.menuUsuarioAberto = false;
    }
    fecharTodosMenus() {
        this.menuMobileAberto = false;
        this.menuUsuarioAberto = false;
        this.menuCategoriasAberto = false;
    }
    fecharMenusAoClicarFora(event) {
        const target = event.target;
        const navbar = document.querySelector('.navbar');
        if (navbar && !navbar.contains(target)) {
            this.fecharTodosMenus();
        }
    }
    pesquisar() {
        if (this.termoPesquisa.trim()) {
            this.router.navigate(['/cursos'], {
                queryParams: { pesquisa: this.termoPesquisa.trim() }
            });
            this.fecharTodosMenus();
        }
    }
    navegarParaCategoria(categoria) {
        this.router.navigate(['/cursos'], {
            queryParams: { categoria }
        });
        this.fecharTodosMenus();
    }
    navegarParaPerfil() {
        if (this.usuarioLogado) {
            const rotaPerfil = this.obterRotaPerfil();
            this.router.navigate([rotaPerfil]);
            this.fecharTodosMenus();
        }
    }
    obterRotaPerfil() {
        switch (this.usuarioLogado?.tipoUsuario) {
            case 'estudante':
                return '/estudante/perfil';
            case 'professor':
                return '/professor/perfil';
            case 'administrador':
                return '/admin/perfil';
            default:
                return '/perfil';
        }
    }
    navegarParaConfiguracoes() {
        if (this.usuarioLogado) {
            const rotaConfiguracoes = this.obterRotaConfiguracoes();
            this.router.navigate([rotaConfiguracoes]);
            this.fecharTodosMenus();
        }
    }
    obterRotaConfiguracoes() {
        switch (this.usuarioLogado?.tipoUsuario) {
            case 'estudante':
                return '/estudante/configuracoes';
            case 'professor':
                return '/professor/configuracoes';
            case 'administrador':
                return '/admin/configuracoes';
            default:
                return '/configuracoes';
        }
    }
    async logout() {
        try {
            await this.autenticacaoServico.logout();
            this.router.navigate(['/']);
            this.fecharTodosMenus();
        }
        catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }
    navegarParaLogin() {
        this.router.navigate(['/login']);
        this.fecharTodosMenus();
    }
    navegarParaRegistro() {
        this.router.navigate(['/registro']);
        this.fecharTodosMenus();
    }
    obterNomeExibicao() {
        if (!this.usuarioLogado)
            return '';
        const nome = this.usuarioLogado.nome || this.usuarioLogado.email;
        const partesNome = nome.split(' ');
        if (partesNome.length >= 2) {
            return `${partesNome[0]} ${partesNome[1]}`;
        }
        return partesNome[0];
    }
    obterIniciais() {
        if (!this.usuarioLogado)
            return '';
        const nome = this.usuarioLogado.nome || this.usuarioLogado.email;
        const partesNome = nome.split(' ');
        if (partesNome.length >= 2) {
            return `${partesNome[0][0]}${partesNome[1][0]}`.toUpperCase();
        }
        return partesNome[0].substring(0, 2).toUpperCase();
    }
    obterCorAvatar() {
        if (!this.usuarioLogado)
            return '#6366f1';
        const cores = [
            '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
            '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
        ];
        const indice = this.usuarioLogado.email.charCodeAt(0) % cores.length;
        return cores[indice];
    }
    verificarPermissao(permissao) {
        return this.autenticacaoServico.verificarPermissao(permissao);
    }
    ehTipoUsuario(tipo) {
        return this.usuarioLogado?.tipoUsuario === tipo;
    }
    onKeydownPesquisa(event) {
        if (event.key === 'Enter') {
            this.pesquisar();
        }
    }
    obterTipoUsuarioTexto() {
        switch (this.usuarioLogado?.tipoUsuario) {
            case 'estudante':
                return 'Estudante';
            case 'professor':
                return 'Professor';
            case 'administrador':
                return 'Administrador';
            default:
                return 'Usuário';
        }
    }
};
BarraNavegacaoComponent = __decorate([
    Component({
        selector: 'app-barra-navegacao',
        templateUrl: './barra-navegacao.component.html',
        styleUrls: ['./barra-navegacao.component.css']
    })
], BarraNavegacaoComponent);
export { BarraNavegacaoComponent };
//# sourceMappingURL=barra-navegacao.component.js.map