import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let CursosService = class CursosService {
    constructor(http) {
        this.http = http;
        this.apiUrl = environment.apiUrl;
    }
    listarCursos(filtros) {
        let url = `${this.apiUrl}/cursos`;
        if (filtros) {
            const params = new URLSearchParams();
            if (filtros.categoria)
                params.append('categoria', filtros.categoria);
            if (filtros.nivel)
                params.append('nivel', filtros.nivel);
            if (filtros.preco)
                params.append('preco', filtros.preco);
            url += `?${params.toString()}`;
        }
        return this.http.get(url);
    }
    obterCurso(id) {
        return this.http.get(`${this.apiUrl}/cursos/${id}`);
    }
    criarCurso(curso) {
        return this.http.post(`${this.apiUrl}/cursos`, curso);
    }
    atualizarCurso(id, curso) {
        return this.http.put(`${this.apiUrl}/cursos/${id}`, curso);
    }
    removerCurso(id) {
        return this.http.delete(`${this.apiUrl}/cursos/${id}`);
    }
    inscreverEmCurso(cursoId) {
        return this.http.post(`${this.apiUrl}/estudantes/cursos/${cursoId}/inscrever`, {});
    }
    listarCursosInscritos() {
        return this.http.get(`${this.apiUrl}/estudantes/cursos`);
    }
    listarCursosProfessor() {
        return this.http.get(`${this.apiUrl}/professores/cursos`);
    }
    obterEstatisticasCurso(cursoId) {
        return this.http.get(`${this.apiUrl}/professores/cursos/${cursoId}/estatisticas`);
    }
    criarQuiz(cursoId, quiz) {
        return this.http.post(`${this.apiUrl}/cursos/${cursoId}/quizzes`, quiz);
    }
    responderQuiz(cursoId, quizId, respostas) {
        return this.http.post(`${this.apiUrl}/cursos/${cursoId}/quizzes/${quizId}/responder`, { respostas });
    }
    obterProgressoEstudante(cursoId) {
        return this.http.get(`${this.apiUrl}/estudantes/progresso/${cursoId}`);
    }
    marcarConteudoConcluido(cursoId, conteudoId) {
        return this.http.post(`${this.apiUrl}/estudantes/progresso/${cursoId}/conteudo/${conteudoId}`, {});
    }
};
CursosService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CursosService);
export { CursosService };
//# sourceMappingURL=cursos.service.js.map