import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacao {
  id: string;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  titulo: string;
  mensagem: string;
  duracao?: number; // em milissegundos, 0 = permanente
  acao?: {
    texto: string;
    callback: () => void;
  };
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoServico {
  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  public notificacoes$ = this.notificacoesSubject.asObservable();

  private duracaoPadrao = 5000; // 5 segundos

  constructor() {}

  private gerarId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private adicionarNotificacao(notificacao: Notificacao): void {
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

  sucesso(titulo: string, mensagem: string, duracao?: number): string {
    const notificacao: Notificacao = {
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

  erro(titulo: string, mensagem: string, duracao?: number): string {
    const notificacao: Notificacao = {
      id: this.gerarId(),
      tipo: 'erro',
      titulo,
      mensagem,
      duracao: duracao || 8000, // Erros ficam mais tempo
      timestamp: new Date()
    };
    this.adicionarNotificacao(notificacao);
    return notificacao.id;
  }

  aviso(titulo: string, mensagem: string, duracao?: number): string {
    const notificacao: Notificacao = {
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

  info(titulo: string, mensagem: string, duracao?: number): string {
    const notificacao: Notificacao = {
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

  comAcao(
    tipo: 'sucesso' | 'erro' | 'aviso' | 'info',
    titulo: string,
    mensagem: string,
    textoAcao: string,
    callback: () => void,
    duracao?: number
  ): string {
    const notificacao: Notificacao = {
      id: this.gerarId(),
      tipo,
      titulo,
      mensagem,
      duracao: duracao || 0, // Notificações com ação são permanentes por padrão
      acao: {
        texto: textoAcao,
        callback
      },
      timestamp: new Date()
    };
    this.adicionarNotificacao(notificacao);
    return notificacao.id;
  }

  removerNotificacao(id: string): void {
    const notificacoesAtuais = this.notificacoesSubject.value;
    const notificacoesFiltradas = notificacoesAtuais.filter(n => n.id !== id);
    this.notificacoesSubject.next(notificacoesFiltradas);
  }

  limparTodas(): void {
    this.notificacoesSubject.next([]);
  }

  // Métodos de conveniência para casos comuns
  loginSucesso(nomeUsuario: string): string {
    return this.sucesso(
      'Login realizado!',
      `Bem-vindo(a), ${nomeUsuario}!`
    );
  }

  logoutSucesso(): string {
    return this.info(
      'Logout realizado',
      'Você foi desconectado com sucesso.'
    );
  }

  matriculaSucesso(nomeCurso: string): string {
    return this.sucesso(
      'Matrícula realizada!',
      `Você foi matriculado no curso "${nomeCurso}".`
    );
  }

  quizConcluido(nota: number, aprovado: boolean): string {
    if (aprovado) {
      return this.sucesso(
        'Quiz concluído!',
        `Parabéns! Você foi aprovado com nota ${nota}%.`
      );
    } else {
      return this.aviso(
        'Quiz concluído',
        `Você obteve ${nota}%. Continue estudando para melhorar!`
      );
    }
  }

  moduloConcluido(nomeModulo: string): string {
    return this.sucesso(
      'Módulo concluído!',
      `Você completou o módulo "${nomeModulo}".`
    );
  }

  cursoConcluido(nomeCurso: string): string {
    return this.comAcao(
      'sucesso',
      'Curso concluído!',
      `Parabéns! Você completou o curso "${nomeCurso}".`,
      'Ver Certificado',
      () => {
        // Implementar navegação para certificado
        console.log('Navegar para certificado');
      }
    );
  }

  erroConexao(): string {
    return this.erro(
      'Erro de conexão',
      'Não foi possível conectar ao servidor. Verifique sua conexão.',
      0 // Permanente até ser removida manualmente
    );
  }

  erroAutenticacao(): string {
    return this.erro(
      'Erro de autenticação',
      'Sua sessão expirou. Faça login novamente.',
      0
    );
  }

  salvamentoAutomatico(): string {
    return this.info(
      'Progresso salvo',
      'Seu progresso foi salvo automaticamente.',
      3000
    );
  }

  carregando(mensagem: string = 'Carregando...'): string {
    return this.info(
      'Aguarde',
      mensagem,
      0 // Permanente até ser removida
    );
  }

  // Método para atualizar uma notificação existente
  atualizarNotificacao(id: string, atualizacoes: Partial<Notificacao>): void {
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
  existeNotificacao(id: string): boolean {
    return this.notificacoesSubject.value.some(n => n.id === id);
  }

  // Obter contagem de notificações por tipo
  obterContagem(): { [tipo: string]: number } {
    const notificacoes = this.notificacoesSubject.value;
    return {
      sucesso: notificacoes.filter(n => n.tipo === 'sucesso').length,
      erro: notificacoes.filter(n => n.tipo === 'erro').length,
      aviso: notificacoes.filter(n => n.tipo === 'aviso').length,
      info: notificacoes.filter(n => n.tipo === 'info').length,
      total: notificacoes.length
    };
  }
}