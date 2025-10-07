import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let CursoServico = class CursoServico {
    constructor(autenticacaoServico) {
        this.autenticacaoServico = autenticacaoServico;
        this.API_URL = 'http://localhost:3000/api';
        this.cursosSubject = new BehaviorSubject([]);
        this.cursoAtualSubject = new BehaviorSubject(null);
        this.progressoSubject = new BehaviorSubject([]);
        this.cursos$ = this.cursosSubject.asObservable();
        this.cursoAtual$ = this.cursoAtualSubject.asObservable();
        this.progresso$ = this.progressoSubject.asObservable();
    }
    // Métodos para obter cursos
    async obterTodosCursos(filtros) {
        try {
            const queryParams = new URLSearchParams();
            if (filtros) {
                Object.entries(filtros).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
            }
            const url = `${this.API_URL}/cursos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const response = await fetch(url, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                this.cursosSubject.next(data.cursos || []);
                return data.cursos || [];
            }
            else {
                throw new Error('Erro ao carregar cursos');
            }
        }
        catch (error) {
            console.error('Erro ao obter cursos:', error);
            return [];
        }
    }
    async obterCursoPorId(id) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${id}`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                this.cursoAtualSubject.next(data.curso);
                return data.curso;
            }
            else {
                throw new Error('Curso não encontrado');
            }
        }
        catch (error) {
            console.error('Erro ao obter curso:', error);
            return null;
        }
    }
    async obterCursosDestaque() {
        try {
            const response = await fetch(`${this.API_URL}/cursos/destaque`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.cursos || [];
            }
            else {
                throw new Error('Erro ao carregar cursos em destaque');
            }
        }
        catch (error) {
            console.error('Erro ao obter cursos em destaque:', error);
            return [];
        }
    }
    async obterCursosPorCategoria(categoria) {
        return this.obterTodosCursos({ categoria });
    }
    async obterCursosDoEstudante() {
        try {
            const usuario = this.autenticacaoServico.obterUsuarioAtual();
            if (!usuario || usuario.tipo !== 'estudante') {
                return [];
            }
            const response = await fetch(`${this.API_URL}/estudantes/${usuario.id}/cursos`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.cursos || [];
            }
            else {
                throw new Error('Erro ao carregar cursos do estudante');
            }
        }
        catch (error) {
            console.error('Erro ao obter cursos do estudante:', error);
            return [];
        }
    }
    async obterCursosDoProfessor() {
        try {
            const usuario = this.autenticacaoServico.obterUsuarioAtual();
            if (!usuario || usuario.tipo !== 'professor') {
                return [];
            }
            const response = await fetch(`${this.API_URL}/professores/${usuario.id}/cursos`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.cursos || [];
            }
            else {
                throw new Error('Erro ao carregar cursos do professor');
            }
        }
        catch (error) {
            console.error('Erro ao obter cursos do professor:', error);
            return [];
        }
    }
    // Métodos para gerenciar inscrições
    async inscreverNoCurso(cursoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/inscrever`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Inscrição realizada com sucesso!' :
                    'Erro ao se inscrever no curso')
            };
        }
        catch (error) {
            console.error('Erro ao inscrever no curso:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async verificarInscricao(cursoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/inscricao`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.inscrito || false;
            }
            return false;
        }
        catch (error) {
            console.error('Erro ao verificar inscrição:', error);
            return false;
        }
    }
    // Métodos para progresso
    async obterProgressoCurso(cursoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/progresso`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.progresso;
            }
            return null;
        }
        catch (error) {
            console.error('Erro ao obter progresso:', error);
            return null;
        }
    }
    async marcarConteudoComoVisto(cursoId, conteudoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/conteudos/${conteudoId}/marcar-visto`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Progresso atualizado!' :
                    'Erro ao atualizar progresso')
            };
        }
        catch (error) {
            console.error('Erro ao marcar conteúdo como visto:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async obterTodoProgresso() {
        try {
            const response = await fetch(`${this.API_URL}/estudantes/progresso`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                this.progressoSubject.next(data.progresso || []);
                return data.progresso || [];
            }
            return [];
        }
        catch (error) {
            console.error('Erro ao obter todo progresso:', error);
            return [];
        }
    }
    // Métodos para professores
    async criarCurso(dadosCurso) {
        try {
            const response = await fetch(`${this.API_URL}/cursos`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados(),
                body: JSON.stringify(dadosCurso)
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Curso criado com sucesso!' :
                    'Erro ao criar curso'),
                curso: data.curso
            };
        }
        catch (error) {
            console.error('Erro ao criar curso:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async atualizarCurso(cursoId, dadosAtualizacao) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}`, {
                method: 'PUT',
                headers: this.autenticacaoServico.obterHeadersAutenticados(),
                body: JSON.stringify(dadosAtualizacao)
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Curso atualizado com sucesso!' :
                    'Erro ao atualizar curso'),
                curso: data.curso
            };
        }
        catch (error) {
            console.error('Erro ao atualizar curso:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async excluirCurso(cursoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}`, {
                method: 'DELETE',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Curso excluído com sucesso!' :
                    'Erro ao excluir curso')
            };
        }
        catch (error) {
            console.error('Erro ao excluir curso:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    // Métodos para estatísticas
    async obterEstatisticasCurso(cursoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/estatisticas`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.estatisticas;
            }
            return null;
        }
        catch (error) {
            console.error('Erro ao obter estatísticas do curso:', error);
            return null;
        }
    }
    async obterEstatisticasGerais() {
        try {
            const response = await fetch(`${this.API_URL}/estatisticas/gerais`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.estatisticas || { totalEstudantes: 0, totalCursos: 0, totalProfessores: 0, horasConteudo: 0 };
            }
            return { totalEstudantes: 0, totalCursos: 0, totalProfessores: 0, horasConteudo: 0 };
        }
        catch (error) {
            console.error('Erro ao obter estatísticas gerais:', error);
            return { totalEstudantes: 0, totalCursos: 0, totalProfessores: 0, horasConteudo: 0 };
        }
    }
    // Métodos para avaliações
    async avaliarCurso(cursoId, nota, comentario) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/avaliar`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados(),
                body: JSON.stringify({ nota, comentario })
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Avaliação enviada com sucesso!' :
                    'Erro ao enviar avaliação')
            };
        }
        catch (error) {
            console.error('Erro ao avaliar curso:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    // Métodos para certificados
    async gerarCertificado(cursoId) {
        try {
            const response = await fetch(`${this.API_URL}/cursos/${cursoId}/certificado`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Certificado gerado com sucesso!' :
                    'Erro ao gerar certificado'),
                certificado: data.certificado
            };
        }
        catch (error) {
            console.error('Erro ao gerar certificado:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    // Métodos auxiliares
    calcularProgressoPercentual(progresso, curso) {
        if (!curso.modulos || curso.modulos.length === 0)
            return 0;
        const totalConteudos = curso.modulos.reduce((total, modulo) => total + (modulo.conteudos?.length || 0), 0);
        if (totalConteudos === 0)
            return 0;
        const conteudosVisualizados = progresso.conteudosVisualizados?.length || 0;
        return Math.round((conteudosVisualizados / totalConteudos) * 100);
    }
    obterProximoConteudo(curso, progresso) {
        for (const modulo of curso.modulos) {
            for (const conteudo of modulo.conteudos) {
                if (!progresso.conteudosVisualizados.includes(conteudo.id)) {
                    return { modulo, conteudo };
                }
            }
        }
        return null;
    }
    formatarDuracao(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas > 0) {
            return `${horas}h${mins > 0 ? ` ${mins}min` : ''}`;
        }
        return `${mins}min`;
    }
};
CursoServico = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CursoServico);
export { CursoServico };
//# sourceMappingURL=curso.servico.js.map