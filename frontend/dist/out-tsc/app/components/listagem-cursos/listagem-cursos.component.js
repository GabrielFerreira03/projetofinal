import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ListagemCursosComponent = class ListagemCursosComponent {
    constructor(cursosService, authService) {
        this.cursosService = cursosService;
        this.authService = authService;
        this.cursos = [];
        this.cursosMatriculados = [];
        this.loading = true;
        this.error = '';
        this.userType = '';
        this.searchTerm = '';
    }
    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.userType = user.tipo;
                this.loadCursos();
            }
        });
    }
    loadCursos() {
        this.loading = true;
        // Carregar todos os cursos
        this.cursosService.listarCursos().subscribe((cursos) => {
            this.cursos = cursos;
            // Se for estudante, carregar cursos matriculados
            if (this.userType === 'estudante') {
                this.cursosService.listarCursosMatriculados().subscribe((matriculados) => {
                    this.cursosMatriculados = matriculados;
                    this.loading = false;
                }, (error) => {
                    this.error = 'Erro ao carregar cursos matriculados';
                    this.loading = false;
                });
            }
            else {
                this.loading = false;
            }
        }, (error) => {
            this.error = 'Erro ao carregar cursos';
            this.loading = false;
        });
    }
    isMatriculado(cursoId) {
        return this.cursosMatriculados.some(curso => curso.id === cursoId);
    }
    matricular(cursoId) {
        this.loading = true;
        this.cursosService.matricularEstudante(cursoId).subscribe(() => {
            // Adicionar curso à lista de matriculados
            const curso = this.cursos.find(c => c.id === cursoId);
            if (curso) {
                this.cursosMatriculados.push(curso);
            }
            this.loading = false;
        }, (error) => {
            this.error = 'Erro ao matricular no curso';
            this.loading = false;
        });
    }
    get cursosFiltrados() {
        if (!this.searchTerm) {
            return this.cursos;
        }
        const term = this.searchTerm.toLowerCase();
        return this.cursos.filter(curso => curso.titulo.toLowerCase().includes(term) ||
            curso.descricao.toLowerCase().includes(term));
    }
};
ListagemCursosComponent = __decorate([
    Component({
        selector: 'app-listagem-cursos',
        templateUrl: './listagem-cursos.component.html'
    })
], ListagemCursosComponent);
export { ListagemCursosComponent };
//# sourceMappingURL=listagem-cursos.component.js.map