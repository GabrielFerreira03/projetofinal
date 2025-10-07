import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificacaoServico, Notificacao } from '../../servicos/notificacao.servico';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  notificacoes: Notificacao[] = [];

  constructor(private notificacaoServico: NotificacaoServico) {}

  ngOnInit(): void {
    this.notificacaoServico.notificacoes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notificacoes => {
        this.notificacoes = notificacoes;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fecharNotificacao(id: string): void {
    this.notificacaoServico.removerNotificacao(id);
  }

  executarAcao(notificacao: Notificacao): void {
    if (notificacao.acao) {
      notificacao.acao.callback();
      this.fecharNotificacao(notificacao.id);
    }
  }

  obterIcone(tipo: string): string {
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

  obterClasseCSS(tipo: string): string {
    return `notificacao notificacao--${tipo}`;
  }

  formatarTempo(timestamp: Date): string {
    const agora = new Date();
    const diferenca = agora.getTime() - new Date(timestamp).getTime();
    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);

    if (segundos < 60) {
      return 'agora';
    } else if (minutos < 60) {
      return `${minutos}m atrás`;
    } else if (horas < 24) {
      return `${horas}h atrás`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  }

  limparTodas(): void {
    this.notificacaoServico.limparTodas();
  }

  temNotificacoes(): boolean {
    return this.notificacoes.length > 0;
  }

  obterNotificacoesPorTipo(tipo: string): Notificacao[] {
    return this.notificacoes.filter(n => n.tipo === tipo);
  }

  // Método para animação de entrada
  onNotificacaoAdicionada(notificacao: Notificacao): void {
    // Implementar animação se necessário
  }

  // Método para animação de saída
  onNotificacaoRemovida(id: string): void {
    // Implementar animação se necessário
  }

  // Método trackBy para otimização de performance
  trackByNotificacao(index: number, notificacao: Notificacao): string {
    return notificacao.id;
  }
}