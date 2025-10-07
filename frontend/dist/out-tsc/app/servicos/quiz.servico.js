import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let QuizServico = class QuizServico {
    constructor(autenticacaoServico) {
        this.autenticacaoServico = autenticacaoServico;
        this.API_URL = 'http://localhost:3000/api';
        this.quizzesSubject = new BehaviorSubject([]);
        this.estadoQuizSubject = new BehaviorSubject(null);
        this.tentativasSubject = new BehaviorSubject([]);
        this.quizzes$ = this.quizzesSubject.asObservable();
        this.estadoQuiz$ = this.estadoQuizSubject.asObservable();
        this.tentativas$ = this.tentativasSubject.asObservable();
    }
    // Métodos para obter quizzes
    async obterTodosQuizzes(filtros) {
        try {
            const queryParams = new URLSearchParams();
            if (filtros) {
                Object.entries(filtros).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
            }
            const url = `${this.API_URL}/quizzes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const response = await fetch(url, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                this.quizzesSubject.next(data.quizzes || []);
                return data.quizzes || [];
            }
            else {
                throw new Error('Erro ao carregar quizzes');
            }
        }
        catch (error) {
            console.error('Erro ao obter quizzes:', error);
            return [];
        }
    }
    async obterQuizPorId(id) {
        try {
            const response = await fetch(`${this.API_URL}/quizzes/${id}`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.quiz;
            }
            else {
                throw new Error('Quiz não encontrado');
            }
        }
        catch (error) {
            console.error('Erro ao obter quiz:', error);
            return null;
        }
    }
    async obterQuizzesPorCurso(cursoId) {
        return this.obterTodosQuizzes({ cursoId });
    }
    async obterQuizzesPorModulo(moduloId) {
        return this.obterTodosQuizzes({ moduloId });
    }
    async obterQuizzesPorCategoria(categoria) {
        return this.obterTodosQuizzes({ categoria });
    }
    // Métodos para realizar quiz
    async iniciarQuiz(quizId) {
        try {
            const response = await fetch(`${this.API_URL}/quizzes/${quizId}/iniciar`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            if (response.ok && data.sucesso) {
                const quiz = await this.obterQuizPorId(quizId);
                if (quiz) {
                    const estadoQuiz = {
                        quiz,
                        tentativaAtual: data.tentativa,
                        perguntaAtual: 0,
                        respostasTemporarias: {},
                        tempoInicio: new Date(),
                        tempoRestante: quiz.configuracoes.tempoLimite ? quiz.configuracoes.tempoLimite * 60 : undefined
                    };
                    this.estadoQuizSubject.next(estadoQuiz);
                }
                return {
                    sucesso: true,
                    mensagem: 'Quiz iniciado com sucesso!',
                    tentativa: data.tentativa
                };
            }
            else {
                return {
                    sucesso: false,
                    mensagem: data.mensagem || 'Erro ao iniciar quiz'
                };
            }
        }
        catch (error) {
            console.error('Erro ao iniciar quiz:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async responderPergunta(tentativaId, perguntaId, resposta) {
        try {
            const response = await fetch(`${this.API_URL}/tentativas/${tentativaId}/responder`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados(),
                body: JSON.stringify({ perguntaId, resposta })
            });
            const data = await response.json();
            // Atualizar estado local
            const estadoAtual = this.estadoQuizSubject.value;
            if (estadoAtual) {
                estadoAtual.respostasTemporarias[perguntaId] = resposta;
                this.estadoQuizSubject.next({ ...estadoAtual });
            }
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Resposta salva!' :
                    'Erro ao salvar resposta')
            };
        }
        catch (error) {
            console.error('Erro ao responder pergunta:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async finalizarQuiz(tentativaId) {
        try {
            const response = await fetch(`${this.API_URL}/tentativas/${tentativaId}/finalizar`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            if (response.ok && data.sucesso) {
                // Limpar estado do quiz
                this.estadoQuizSubject.next(null);
                return {
                    sucesso: true,
                    mensagem: 'Quiz finalizado com sucesso!',
                    resultado: data.resultado
                };
            }
            else {
                return {
                    sucesso: false,
                    mensagem: data.mensagem || 'Erro ao finalizar quiz'
                };
            }
        }
        catch (error) {
            console.error('Erro ao finalizar quiz:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async abandonarQuiz(tentativaId) {
        try {
            const response = await fetch(`${this.API_URL}/tentativas/${tentativaId}/abandonar`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            // Limpar estado do quiz
            this.estadoQuizSubject.next(null);
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Quiz abandonado.' :
                    'Erro ao abandonar quiz')
            };
        }
        catch (error) {
            console.error('Erro ao abandonar quiz:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    // Métodos para obter tentativas e resultados
    async obterTentativasQuiz(quizId) {
        try {
            const response = await fetch(`${this.API_URL}/quizzes/${quizId}/tentativas`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.tentativas || [];
            }
            return [];
        }
        catch (error) {
            console.error('Erro ao obter tentativas:', error);
            return [];
        }
    }
    async obterResultadoTentativa(tentativaId) {
        try {
            const response = await fetch(`${this.API_URL}/tentativas/${tentativaId}/resultado`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                return data.resultado;
            }
            return null;
        }
        catch (error) {
            console.error('Erro ao obter resultado:', error);
            return null;
        }
    }
    async obterTodasTentativas() {
        try {
            const response = await fetch(`${this.API_URL}/estudantes/tentativas`, {
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            if (response.ok) {
                const data = await response.json();
                this.tentativasSubject.next(data.tentativas || []);
                return data.tentativas || [];
            }
            return [];
        }
        catch (error) {
            console.error('Erro ao obter todas tentativas:', error);
            return [];
        }
    }
    // Métodos para professores
    async criarQuiz(dadosQuiz) {
        try {
            const response = await fetch(`${this.API_URL}/quizzes`, {
                method: 'POST',
                headers: this.autenticacaoServico.obterHeadersAutenticados(),
                body: JSON.stringify(dadosQuiz)
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Quiz criado com sucesso!' :
                    'Erro ao criar quiz'),
                quiz: data.quiz
            };
        }
        catch (error) {
            console.error('Erro ao criar quiz:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async atualizarQuiz(quizId, dadosAtualizacao) {
        try {
            const response = await fetch(`${this.API_URL}/quizzes/${quizId}`, {
                method: 'PUT',
                headers: this.autenticacaoServico.obterHeadersAutenticados(),
                body: JSON.stringify(dadosAtualizacao)
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Quiz atualizado com sucesso!' :
                    'Erro ao atualizar quiz'),
                quiz: data.quiz
            };
        }
        catch (error) {
            console.error('Erro ao atualizar quiz:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async excluirQuiz(quizId) {
        try {
            const response = await fetch(`${this.API_URL}/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: this.autenticacaoServico.obterHeadersAutenticados()
            });
            const data = await response.json();
            return {
                sucesso: response.ok,
                mensagem: data.mensagem || (response.ok ?
                    'Quiz excluído com sucesso!' :
                    'Erro ao excluir quiz')
            };
        }
        catch (error) {
            console.error('Erro ao excluir quiz:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    // Métodos para navegação no quiz
    proximaPergunta() {
        const estado = this.estadoQuizSubject.value;
        if (estado && estado.perguntaAtual < estado.quiz.perguntas.length - 1) {
            estado.perguntaAtual++;
            this.estadoQuizSubject.next({ ...estado });
        }
    }
    perguntaAnterior() {
        const estado = this.estadoQuizSubject.value;
        if (estado && estado.perguntaAtual > 0 && estado.quiz.configuracoes.permitirVoltarPergunta) {
            estado.perguntaAtual--;
            this.estadoQuizSubject.next({ ...estado });
        }
    }
    irParaPergunta(indice) {
        const estado = this.estadoQuizSubject.value;
        if (estado && indice >= 0 && indice < estado.quiz.perguntas.length) {
            estado.perguntaAtual = indice;
            this.estadoQuizSubject.next({ ...estado });
        }
    }
    // Métodos auxiliares
    calcularTempoGasto(tentativa) {
        if (!tentativa.dataFinalizacao)
            return 0;
        const inicio = new Date(tentativa.dataInicio).getTime();
        const fim = new Date(tentativa.dataFinalizacao).getTime();
        return Math.round((fim - inicio) / 1000); // em segundos
    }
    obterNotaPercentual(tentativa) {
        return Math.round((tentativa.pontuacaoTotal / tentativa.pontuacaoMaxima) * 100);
    }
    verificarAprovacao(tentativa, quiz) {
        const percentual = this.obterNotaPercentual(tentativa);
        return percentual >= quiz.configuracoes.notaMinima;
    }
    embaralharArray(array) {
        const arrayEmbaralhado = [...array];
        for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
        }
        return arrayEmbaralhado;
    }
    formatarTempo(segundos) {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        if (horas > 0) {
            return `${horas}h ${minutos}min ${segs}s`;
        }
        else if (minutos > 0) {
            return `${minutos}min ${segs}s`;
        }
        else {
            return `${segs}s`;
        }
    }
    obterEstatisticasQuiz(quiz) {
        return {
            totalPerguntas: quiz.perguntas.length,
            pontuacaoMaxima: quiz.perguntas.reduce((total, pergunta) => total + pergunta.pontuacao, 0),
            tempoEstimado: quiz.configuracoes.tempoLimite || 'Sem limite',
            dificuldadeMedia: this.calcularDificuldadeMedia(quiz.perguntas),
            categorias: this.obterCategoriasPergunta(quiz.perguntas)
        };
    }
    calcularDificuldadeMedia(perguntas) {
        const pesos = { facil: 1, medio: 2, dificil: 3 };
        const somaTotal = perguntas.reduce((soma, pergunta) => soma + pesos[pergunta.dificuldade], 0);
        const media = somaTotal / perguntas.length;
        if (media <= 1.5)
            return 'Fácil';
        if (media <= 2.5)
            return 'Médio';
        return 'Difícil';
    }
    obterCategoriasPergunta(perguntas) {
        const categorias = new Set();
        perguntas.forEach(pergunta => {
            pergunta.tags.forEach(tag => categorias.add(tag));
        });
        return Array.from(categorias);
    }
    // Método para limpar estado
    limparEstadoQuiz() {
        this.estadoQuizSubject.next(null);
    }
};
QuizServico = __decorate([
    Injectable({
        providedIn: 'root'
    })
], QuizServico);
export { QuizServico };
//# sourceMappingURL=quiz.servico.js.map