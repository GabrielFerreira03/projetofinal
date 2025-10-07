import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let NotificacaoServico = class NotificacaoServico {
    constructor() {
        this.notificacoesSubject = new BehaviorSubject([]);
        this.notificacoes$ = this.notificacoesSubject.asObservable();
        this.duracaoPadrao = 5000; // 5 segundos
    }
    gerarId() {
        return Math.random().toString(36).substr(2, 9);
    }
    adicionarNotificacao(notificacao) {
        const notificacoesAtuais = this.notificacoesSubject.value;
        this.notificacoesSubject.next([...notificacoesAtuais, notificacao]);
        // Auto-remover após duração especificada
        if (notificacao.duracao !== 0) {
            const duracao = notificacao.duracao || this.duracaoPadrao;
            setTimeout(() => {
                this.removerNotificacao(notificacao.id);
            }, duracao);
        }
    }
    sucesso(titulo, mensagem, duracao) {
        const notificacao = {
            id: this.gerarId(),
            tipo: 'sucesso',
            titulo,
            mensagem,
            duracao,
            timestamp: new Date()
        };
        this.adicionarNotificacao(notificacao);
        return notificacao.id;
    }
    erro(titulo, mensagem, duracao) {
        const notificacao = {
            id: this.gerarId(),
            tipo: 'erro',
            titulo,
            mensagem,
            duracao: duracao || 8000,
            timestamp: new Date()
        };
        this.adicionarNotificacao(notificacao);
        return notificacao.id;
    }
    aviso(titulo, mensagem, duracao) {
        const notificacao = {
            id: this.gerarId(),
            tipo: 'aviso',
            titulo,
            mensagem,
            duracao,
            timestamp: new Date()
        };
        this.adicionarNotificacao(notificacao);
        return notificacao.id;
    }
    info(titulo, mensagem, duracao) {
        const notificacao = {
            id: this.gerarId(),
            tipo: 'info',
            titulo,
            mensagem,
            duracao,
            timestamp: new Date()
        };
        this.adicionarNotificacao(notificacao);
        return notificacao.id;
    }
    comAcao(tipo, titulo, mensagem, textoAcao, callback, duracao) {
        const notificacao = {
            id: this.gerarId(),
            tipo,
            titulo,
            mensagem,
            duracao: duracao || 0,
            acao: {
                texto: textoAcao,
                callback
            },
            timestamp: new Date()
        };
        this.adicionarNotificacao(notificacao);
        return notificacao.id;
    }
    removerNotificacao(id) {
        const notificacoesAtuais = this.notificacoesSubject.value;
        const notificacoesFiltradas = notificacoesAtuais.filter(n => n.id !== id);
        this.notificacoesSubject.next(notificacoesFiltradas);
    }
    limparTodas() {
        this.notificacoesSubject.next([]);
    }
    // Métodos de conveniência para casos comuns
    loginSucesso(nomeUsuario) {
        return this.sucesso('Login realizado!', `Bem-vindo(a), ${nomeUsuario}!`);
    }
    logoutSucesso() {
        return this.info('Logout realizado', 'Você foi desconectado com sucesso.');
    }
    matriculaSucesso(nomeCurso) {
        return this.sucesso('Matrícula realizada!', `Você foi matriculado no curso "${nomeCurso}".`);
    }
    quizConcluido(nota, aprovado) {
        if (aprovado) {
            return this.sucesso('Quiz concluído!', `Parabéns! Você foi aprovado com nota ${nota}%.`);
        }
        else {
            return this.aviso('Quiz concluído', `Você obteve ${nota}%. Continue estudando para melhorar!`);
        }
    }
    moduloConcluido(nomeModulo) {
        return this.sucesso('Módulo concluído!', `Você completou o módulo "${nomeModulo}".`);
    }
    cursoConcluido(nomeCurso) {
        return this.comAcao('sucesso', 'Curso concluído!', `Parabéns! Você completou o curso "${nomeCurso}".`, 'Ver Certificado', () => {
            // Implementar navegação para certificado
            console.log('Navegar para certificado');
        });
    }
    erroConexao() {
        return this.erro('Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.', 0 // Permanente até ser removida manualmente
        );
    }
    erroAutenticacao() {
        return this.erro('Erro de autenticação', 'Sua sessão expirou. Faça login novamente.', 0);
    }
    salvamentoAutomatico() {
        return this.info('Progresso salvo', 'Seu progresso foi salvo automaticamente.', 3000);
    }
    carregando(mensagem = 'Carregando...') {
        return this.info('Aguarde', mensagem, 0 // Permanente até ser removida
        );
    }
    // Método para atualizar uma notificação existente
    atualizarNotificacao(id, atualizacoes) {
        const notificacoesAtuais = this.notificacoesSubject.value;
        const notificacoesAtualizadas = notificacoesAtuais.map(notificacao => {
            if (notificacao.id === id) {
                return { ...notificacao, ...atualizacoes };
            }
            return notificacao;
        });
        this.notificacoesSubject.next(notificacoesAtualizadas);
    }
    // Verificar se existe uma notificação específica
    existeNotificacao(id) {
        return this.notificacoesSubject.value.some(n => n.id === id);
    }
    // Obter contagem de notificações por tipo
    obterContagem() {
        const notificacoes = this.notificacoesSubject.value;
        return {
            sucesso: notificacoes.filter(n => n.tipo === 'sucesso').length,
            erro: notificacoes.filter(n => n.tipo === 'erro').length,
            aviso: notificacoes.filter(n => n.tipo === 'aviso').length,
            info: notificacoes.filter(n => n.tipo === 'info').length,
            total: notificacoes.length
        };
    }
};
NotificacaoServico = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificacaoServico);
export { NotificacaoServico };
//# sourceMappingURL=notificacao.servico.js.map