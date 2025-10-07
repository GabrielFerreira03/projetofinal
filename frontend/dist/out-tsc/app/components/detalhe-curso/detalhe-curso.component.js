import { __decorate } from "tslib";
import { Component } from '@angular/core';
let DetalheCursoComponent = class DetalheCursoComponent {
    constructor(route, cursosService, authService) {
        this.route = route;
        this.cursosService = cursosService;
        this.authService = authService;
        this.curso = null;
        this.moduloAtivo = null;
        this.conteudoAtivo = null;
        this.loading = true;
        this.error = '';
        this.userType = '';
        this.progresso = {};
    }
    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userType = user.tipo;
                this.carregarCurso();
            }
        });
    }
    carregarCurso() {
        const cursoId = this.route.snapshot.paramMap.get('id');
        if (!cursoId) {
            this.error = 'ID do curso não encontrado';
            this.loading = false;
            return;
        }
        this.cursosService.obterCurso(cursoId).subscribe((curso) => {
            this.curso = curso;
            // Selecionar primeiro módulo por padrão se existir
            if (curso.modulos && curso.modulos.length > 0) {
                this.selecionarModulo(curso.modulos[0]);
            }
            // Se for estudante, carregar progresso
            if (this.userType === 'estudante') {
                this.carregarProgresso(cursoId);
            }
            else {
                this.loading = false;
            }
        }, (error) => {
            this.error = 'Erro ao carregar detalhes do curso';
            this.loading = false;
        });
    }
    carregarProgresso(cursoId) {
        this.cursosService.obterProgressoEstudante(cursoId).subscribe((progresso) => {
            this.progresso = progresso;
            this.loading = false;
        }, (error) => {
            this.error = 'Erro ao carregar progresso do curso';
            this.loading = false;
        });
    }
    selecionarModulo(modulo) {
        this.moduloAtivo = modulo;
        // Selecionar primeiro conteúdo por padrão se existir
        if (modulo.conteudos && modulo.conteudos.length > 0) {
            this.selecionarConteudo(modulo.conteudos[0]);
        }
        else {
            this.conteudoAtivo = null;
        }
    }
    selecionarConteudo(conteudo) {
        this.conteudoAtivo = conteudo;
        // Se for estudante, marcar conteúdo como visualizado
        if (this.userType === 'estudante' && this.curso) {
            this.marcarComoVisualizado(this.curso.id, this.moduloAtivo?.id || '', conteudo.id);
        }
    }
    marcarComoVisualizado(cursoId, moduloId, conteudoId) {
        this.cursosService.marcarConteudoComoVisualizado(cursoId, moduloId, conteudoId).subscribe(() => {
            // Atualizar progresso local
            if (!this.progresso.conteudosVisualizados) {
                this.progresso.conteudosVisualizados = [];
            }
            if (!this.progresso.conteudosVisualizados.includes(conteudoId)) {
                this.progresso.conteudosVisualizados.push(conteudoId);
            }
        }, (error) => {
            console.error('Erro ao marcar conteúdo como visualizado', error);
        });
    }
    conteudoVisualizado(conteudoId) {
        return this.progresso &&
            this.progresso.conteudosVisualizados &&
            this.progresso.conteudosVisualizados.includes(conteudoId);
    }
    calcularProgressoModulo(modulo) {
        if (!modulo.conteudos || modulo.conteudos.length === 0 || !this.progresso.conteudosVisualizados) {
            return 0;
        }
        const total = modulo.conteudos.length;
        const visualizados = modulo.conteudos.filter(c => this.progresso.conteudosVisualizados.includes(c.id)).length;
        return Math.round((visualizados / total) * 100);
    }
    calcularProgressoCurso() {
        if (!this.curso || !this.curso.modulos || !this.progresso.conteudosVisualizados) {
            return 0;
        }
        const totalConteudos = this.curso.modulos.reduce((total, modulo) => total + (modulo.conteudos ? modulo.conteudos.length : 0), 0);
        if (totalConteudos === 0) {
            return 0;
        }
        return Math.round((this.progresso.conteudosVisualizados.length / totalConteudos) * 100);
    }
};
DetalheCursoComponent = __decorate([
    Component({
        selector: 'app-detalhe-curso',
        templateUrl: './detalhe-curso.component.html'
    })
], DetalheCursoComponent);
export { DetalheCursoComponent };
//# sourceMappingURL=detalhe-curso.component.js.map