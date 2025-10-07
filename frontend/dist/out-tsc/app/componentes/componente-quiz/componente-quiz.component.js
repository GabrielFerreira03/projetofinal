import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
let ComponenteQuizComponent = class ComponenteQuizComponent {
    constructor(route, router, quizServico, autenticacaoServico) {
        this.route = route;
        this.router = router;
        this.quizServico = quizServico;
        this.autenticacaoServico = autenticacaoServico;
        this.quiz = null;
        this.usuarioAtual = null;
        this.tentativaAtual = null;
        // Estados da interface
        this.carregando = true;
        this.erro = null;
        this.estadoQuiz = 'inicial';
        // Navegação de perguntas
        this.perguntaAtualIndex = 0;
        this.perguntaAtual = null;
        this.respostaSelecionada = null;
        this.respostasUsuario = {};
        // Timer
        this.tempoRestante = 0;
        this.timerSubscription = null;
        // Resultados
        this.resultado = null;
        this.mostrarResultados = false;
        this.mostrarRevisao = false;
        // Configurações de exibição
        this.mostrarProgresso = true;
        this.mostrarTimer = true;
        this.permitirVoltarPergunta = true;
        this.subscriptions = [];
    }
    ngOnInit() {
        this.verificarUsuario();
        this.carregarQuiz();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.pararTimer();
    }
    verificarUsuario() {
        this.usuarioAtual = this.autenticacaoServico.obterUsuarioAtual();
        if (!this.usuarioAtual) {
            this.router.navigate(['/login']);
            return;
        }
    }
    carregarQuiz() {
        const quizId = this.route.snapshot.paramMap.get('id');
        if (!quizId) {
            this.erro = 'ID do quiz não encontrado';
            this.carregando = false;
            return;
        }
        this.carregando = true;
        const sub = this.quizServico.obterQuizPorId(quizId).subscribe({
            next: (quiz) => {
                this.quiz = quiz;
                this.verificarTentativaExistente();
                this.carregando = false;
            },
            error: (erro) => {
                console.error('Erro ao carregar quiz:', erro);
                this.erro = 'Erro ao carregar quiz';
                this.carregando = false;
            }
        });
        this.subscriptions.push(sub);
    }
    verificarTentativaExistente() {
        if (!this.usuarioAtual || !this.quiz)
            return;
        const sub = this.quizServico.obterTentativaAtiva(this.quiz.id, this.usuarioAtual.id).subscribe({
            next: (tentativa) => {
                if (tentativa) {
                    this.tentativaAtual = tentativa;
                    this.restaurarEstadoTentativa();
                }
            },
            error: (erro) => {
                console.error('Erro ao verificar tentativa:', erro);
            }
        });
        this.subscriptions.push(sub);
    }
    restaurarEstadoTentativa() {
        if (!this.tentativaAtual || !this.quiz)
            return;
        this.estadoQuiz = 'em-andamento';
        this.respostasUsuario = { ...this.tentativaAtual.respostas };
        this.perguntaAtualIndex = this.tentativaAtual.perguntaAtual || 0;
        this.atualizarPerguntaAtual();
        // Restaurar timer se aplicável
        if (this.quiz.configuracoes.tempoLimite && this.tentativaAtual.tempoRestante) {
            this.tempoRestante = this.tentativaAtual.tempoRestante;
            this.iniciarTimer();
        }
    }
    // Métodos de controle do quiz
    iniciarQuiz() {
        if (!this.usuarioAtual || !this.quiz)
            return;
        const sub = this.quizServico.iniciarTentativa(this.quiz.id, this.usuarioAtual.id).subscribe({
            next: (tentativa) => {
                this.tentativaAtual = tentativa;
                this.estadoQuiz = 'em-andamento';
                this.perguntaAtualIndex = 0;
                this.atualizarPerguntaAtual();
                // Iniciar timer se configurado
                if (this.quiz.configuracoes.tempoLimite) {
                    this.tempoRestante = this.quiz.configuracoes.tempoLimite * 60; // converter para segundos
                    this.iniciarTimer();
                }
            },
            error: (erro) => {
                console.error('Erro ao iniciar quiz:', erro);
                alert('Erro ao iniciar quiz. Tente novamente.');
            }
        });
        this.subscriptions.push(sub);
    }
    atualizarPerguntaAtual() {
        if (!this.quiz || this.perguntaAtualIndex >= this.quiz.perguntas.length) {
            this.perguntaAtual = null;
            return;
        }
        this.perguntaAtual = this.quiz.perguntas[this.perguntaAtualIndex];
        this.respostaSelecionada = this.respostasUsuario[this.perguntaAtual.id] || null;
    }
    selecionarResposta(alternativaId) {
        if (!this.perguntaAtual)
            return;
        this.respostaSelecionada = alternativaId;
        this.respostasUsuario[this.perguntaAtual.id] = alternativaId;
        // Salvar progresso automaticamente
        this.salvarProgresso();
    }
    salvarProgresso() {
        if (!this.tentativaAtual || !this.usuarioAtual || !this.quiz)
            return;
        const dadosProgresso = {
            tentativaId: this.tentativaAtual.id,
            perguntaAtual: this.perguntaAtualIndex,
            respostas: this.respostasUsuario,
            tempoRestante: this.tempoRestante
        };
        const sub = this.quizServico.salvarProgresso(dadosProgresso).subscribe({
            error: (erro) => {
                console.error('Erro ao salvar progresso:', erro);
            }
        });
        this.subscriptions.push(sub);
    }
    proximaPergunta() {
        if (!this.perguntaAtual || !this.respostaSelecionada) {
            alert('Por favor, selecione uma resposta antes de continuar.');
            return;
        }
        if (this.perguntaAtualIndex < (this.quiz?.perguntas.length || 0) - 1) {
            this.perguntaAtualIndex++;
            this.atualizarPerguntaAtual();
        }
        else {
            this.finalizarQuiz();
        }
    }
    perguntaAnterior() {
        if (this.perguntaAtualIndex > 0) {
            this.perguntaAtualIndex--;
            this.atualizarPerguntaAtual();
        }
    }
    irParaPergunta(index) {
        if (index >= 0 && index < (this.quiz?.perguntas.length || 0)) {
            this.perguntaAtualIndex = index;
            this.atualizarPerguntaAtual();
        }
    }
    finalizarQuiz() {
        if (!this.tentativaAtual || !this.usuarioAtual || !this.quiz)
            return;
        // Verificar se todas as perguntas foram respondidas
        const perguntasNaoRespondidas = this.quiz.perguntas.filter(pergunta => !this.respostasUsuario[pergunta.id]);
        if (perguntasNaoRespondidas.length > 0) {
            const confirmar = confirm(`Você ainda não respondeu ${perguntasNaoRespondidas.length} pergunta(s). Deseja finalizar mesmo assim?`);
            if (!confirmar)
                return;
        }
        this.pararTimer();
        const dadosFinalizacao = {
            tentativaId: this.tentativaAtual.id,
            respostas: this.respostasUsuario,
            tempoGasto: this.calcularTempoGasto()
        };
        const sub = this.quizServico.finalizarTentativa(dadosFinalizacao).subscribe({
            next: (resultado) => {
                this.resultado = resultado;
                this.estadoQuiz = 'finalizado';
                this.mostrarResultados = true;
            },
            error: (erro) => {
                console.error('Erro ao finalizar quiz:', erro);
                alert('Erro ao finalizar quiz. Tente novamente.');
            }
        });
        this.subscriptions.push(sub);
    }
    calcularTempoGasto() {
        if (!this.quiz?.configuracoes.tempoLimite)
            return 0;
        const tempoTotal = this.quiz.configuracoes.tempoLimite * 60;
        return tempoTotal - this.tempoRestante;
    }
    // Métodos do timer
    iniciarTimer() {
        this.pararTimer();
        this.timerSubscription = interval(1000).subscribe(() => {
            this.tempoRestante--;
            if (this.tempoRestante <= 0) {
                this.tempoEsgotado();
            }
        });
    }
    pararTimer() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
    }
    tempoEsgotado() {
        alert('Tempo esgotado! O quiz será finalizado automaticamente.');
        this.finalizarQuiz();
    }
    // Métodos de exibição
    toggleRevisao() {
        this.mostrarRevisao = !this.mostrarRevisao;
    }
    reiniciarQuiz() {
        if (!this.usuarioAtual || !this.quiz)
            return;
        const confirmar = confirm('Tem certeza que deseja reiniciar o quiz? Todo o progresso será perdido.');
        if (!confirmar)
            return;
        // Reset do estado
        this.estadoQuiz = 'inicial';
        this.perguntaAtualIndex = 0;
        this.respostasUsuario = {};
        this.respostaSelecionada = null;
        this.tentativaAtual = null;
        this.resultado = null;
        this.mostrarResultados = false;
        this.mostrarRevisao = false;
        this.pararTimer();
    }
    voltarAoCurso() {
        const cursoId = this.route.snapshot.paramMap.get('cursoId');
        if (cursoId) {
            this.router.navigate(['/curso', cursoId]);
        }
        else {
            this.router.navigate(['/cursos']);
        }
    }
    // Métodos utilitários
    obterIconeCategoria(categoria) {
        const icones = {
            'logica-programacao': '🧠',
            'web-basico': '🌐',
            'angular': '🅰️',
            'git': '📚',
            'scrum': '⚡',
            'lgpd': '🔒'
        };
        return icones[categoria] || '❓';
    }
    obterCorCategoria(categoria) {
        const cores = {
            'logica-programacao': '#8b5cf6',
            'web-basico': '#06b6d4',
            'angular': '#ef4444',
            'git': '#f59e0b',
            'scrum': '#10b981',
            'lgpd': '#6366f1'
        };
        return cores[categoria] || '#6b7280';
    }
    formatarTempo(segundos) {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        if (horas > 0) {
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
        }
        else {
            return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
        }
    }
    calcularProgresso() {
        if (!this.quiz)
            return 0;
        const totalPerguntas = this.quiz.perguntas.length;
        const perguntasRespondidas = Object.keys(this.respostasUsuario).length;
        return Math.round((perguntasRespondidas / totalPerguntas) * 100);
    }
    obterStatusPergunta(index) {
        if (index === this.perguntaAtualIndex)
            return 'atual';
        const pergunta = this.quiz?.perguntas[index];
        if (pergunta && this.respostasUsuario[pergunta.id])
            return 'respondida';
        return 'nao-respondida';
    }
    obterCorNota(nota) {
        if (nota >= 80)
            return '#10b981'; // Verde
        if (nota >= 60)
            return '#f59e0b'; // Amarelo
        return '#ef4444'; // Vermelho
    }
    obterMensagemResultado(nota) {
        if (nota >= 90)
            return 'Excelente! Você domina o conteúdo!';
        if (nota >= 80)
            return 'Muito bom! Você tem um bom conhecimento!';
        if (nota >= 70)
            return 'Bom trabalho! Continue estudando!';
        if (nota >= 60)
            return 'Você passou! Mas pode melhorar!';
        return 'Precisa estudar mais. Não desista!';
    }
    obterIconeResultado(nota) {
        if (nota >= 80)
            return '🎉';
        if (nota >= 60)
            return '👍';
        return '📚';
    }
    estaRespostaCorreta(perguntaId, alternativaId) {
        if (!this.resultado)
            return false;
        const pergunta = this.quiz?.perguntas.find(p => p.id === perguntaId);
        return pergunta?.respostaCorreta === alternativaId;
    }
    obterRespostaUsuario(perguntaId) {
        return this.respostasUsuario[perguntaId] || null;
    }
    podeAvancar() {
        return this.respostaSelecionada !== null;
    }
    podeVoltar() {
        return this.permitirVoltarPergunta && this.perguntaAtualIndex > 0;
    }
    ehUltimaPergunta() {
        return this.perguntaAtualIndex === (this.quiz?.perguntas.length || 0) - 1;
    }
};
ComponenteQuizComponent = __decorate([
    Component({
        selector: 'app-componente-quiz',
        standalone: true,
        imports: [CommonModule, RouterModule, FormsModule],
        templateUrl: './componente-quiz.component.html',
        styleUrls: ['./componente-quiz.component.css']
    })
], ComponenteQuizComponent);
export { ComponenteQuizComponent };
//# sourceMappingURL=componente-quiz.component.js.map