import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
let NotificacoesComponent = class NotificacoesComponent {
    constructor(notificacaoServico) {
        this.notificacaoServico = notificacaoServico;
        this.destroy$ = new Subject();
        this.notificacoes = [];
    }
    ngOnInit() {
        this.notificacaoServico.notificacoes$
            .pipe(takeUntil(this.destroy$))
            .subscribe(notificacoes => {
            this.notificacoes = notificacoes;
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    fecharNotificacao(id) {
        this.notificacaoServico.removerNotificacao(id);
    }
    executarAcao(notificacao) {
        if (notificacao.acao) {
            notificacao.acao.callback();
            this.fecharNotificacao(notificacao.id);
        }
    }
    obterIcone(tipo) {
        switch (tipo) {
            case 'sucesso':
                return '✅';
            case 'erro':
                return '❌';
            case 'aviso':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return 'ℹ️';
        }
    }
    obterClasseCSS(tipo) {
        return `notificacao notificacao--${tipo}`;
    }
    formatarTempo(timestamp) {
        const agora = new Date();
        const diferenca = agora.getTime() - new Date(timestamp).getTime();
        const segundos = Math.floor(diferenca / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        if (segundos < 60) {
            return 'agora';
        }
        else if (minutos < 60) {
            return `${minutos}m atrás`;
        }
        else if (horas < 24) {
            return `${horas}h atrás`;
        }
        else {
            return new Date(timestamp).toLocaleDateString();
        }
    }
    limparTodas() {
        this.notificacaoServico.limparTodas();
    }
    temNotificacoes() {
        return this.notificacoes.length > 0;
    }
    obterNotificacoesPorTipo(tipo) {
        return this.notificacoes.filter(n => n.tipo === tipo);
    }
    // Método para animação de entrada
    onNotificacaoAdicionada(notificacao) {
        // Implementar animação se necessário
    }
    // Método para animação de saída
    onNotificacaoRemovida(id) {
        // Implementar animação se necessário
    }
    // Método trackBy para otimização de performance
    trackByNotificacao(index, notificacao) {
        return notificacao.id;
    }
};
NotificacoesComponent = __decorate([
    Component({
        selector: 'app-notificacoes',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './notificacoes.component.html',
        styleUrls: ['./notificacoes.component.css']
    })
], NotificacoesComponent);
export { NotificacoesComponent };
//# sourceMappingURL=notificacoes.component.js.map