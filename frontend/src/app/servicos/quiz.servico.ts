import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Quiz, 
  TentativaQuiz, 
  ResultadoQuiz, 
  Pergunta, 
  RespostaTentativa,
  QuizLogicaProgramacao,
  QuizWebBasico,
  QuizAngular,
  QuizGit,
  QuizScrum,
  QuizBancoDados
} from '../modelos/quiz.modelo';
import { CategoriaConteudo } from '../modelos/curso.modelo';
import { AutenticacaoServico } from './autenticacao.servico';

export interface FiltrosQuiz {
  categoria?: CategoriaConteudo;
  cursoId?: string;
  moduloId?: string;
  dificuldade?: 'facil' | 'medio' | 'dificil';
  status?: 'ativo' | 'inativo' | 'rascunho';
}

export interface EstadoQuiz {
  quiz: Quiz;
  tentativaAtual: TentativaQuiz | null;
  perguntaAtual: number;
  respostasTemporarias: { [perguntaId: string]: any };
  tempoInicio: Date;
  tempoRestante?: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizServico {
  private readonly API_URL = 'http://localhost:3002/api';
  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  private estadoQuizSubject = new BehaviorSubject<EstadoQuiz | null>(null);
  private tentativasSubject = new BehaviorSubject<TentativaQuiz[]>([]);

  public quizzes$ = this.quizzesSubject.asObservable();
  public estadoQuiz$ = this.estadoQuizSubject.asObservable();
  public tentativas$ = this.tentativasSubject.asObservable();

  constructor(private autenticacaoServico: AutenticacaoServico) {}

  // Métodos para obter quizzes
  async obterTodosQuizzes(filtros?: FiltrosQuiz): Promise<Quiz[]> {
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
      } else {
        throw new Error('Erro ao carregar quizzes');
      }
    } catch (error) {
      console.error('Erro ao obter quizzes:', error);
      return [];
    }
  }

  async obterQuizPorId(id: string): Promise<Quiz | null> {
    try {
      const response = await fetch(`${this.API_URL}/quizzes/${id}`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.quiz;
      } else {
        throw new Error('Quiz não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter quiz:', error);
      return null;
    }
  }

  async obterQuizzesPorCurso(cursoId: string): Promise<Quiz[]> {
    return this.obterTodosQuizzes({ cursoId });
  }

  async obterQuizzesPorModulo(moduloId: string): Promise<Quiz[]> {
    return this.obterTodosQuizzes({ moduloId });
  }

  async obterQuizzesPorCategoria(categoria: CategoriaConteudo): Promise<Quiz[]> {
    return this.obterTodosQuizzes({ categoria });
  }

  // Métodos para realizar quiz
  async iniciarQuiz(quizId: string): Promise<{ sucesso: boolean; mensagem: string; tentativa?: TentativaQuiz }> {
    try {
      const response = await fetch(`${this.API_URL}/quizzes/${quizId}/iniciar`, {
        method: 'POST',
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        const quiz = await this.obterQuizPorId(quizId);
        if (quiz) {
          const estadoQuiz: EstadoQuiz = {
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
      } else {
        return {
          sucesso: false,
          mensagem: data.mensagem || 'Erro ao iniciar quiz'
        };
      }
    } catch (error) {
      console.error('Erro ao iniciar quiz:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async responderPergunta(
    tentativaId: string, 
    perguntaId: string, 
    resposta: any
  ): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao responder pergunta:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async finalizarQuiz(tentativaId: string): Promise<{ sucesso: boolean; mensagem: string; resultado?: ResultadoQuiz }> {
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
      } else {
        return {
          sucesso: false,
          mensagem: data.mensagem || 'Erro ao finalizar quiz'
        };
      }
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async abandonarQuiz(tentativaId: string): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao abandonar quiz:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  // Métodos para obter tentativas e resultados
  async obterTentativasQuiz(quizId: string): Promise<TentativaQuiz[]> {
    try {
      const response = await fetch(`${this.API_URL}/quizzes/${quizId}/tentativas`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.tentativas || [];
      }
      return [];
    } catch (error) {
      console.error('Erro ao obter tentativas:', error);
      return [];
    }
  }

  async obterResultadoTentativa(tentativaId: string): Promise<ResultadoQuiz | null> {
    try {
      const response = await fetch(`${this.API_URL}/tentativas/${tentativaId}/resultado`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.resultado;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter resultado:', error);
      return null;
    }
  }

  async obterTodasTentativas(): Promise<TentativaQuiz[]> {
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
    } catch (error) {
      console.error('Erro ao obter todas tentativas:', error);
      return [];
    }
  }

  // Métodos para professores
  async criarQuiz(dadosQuiz: Partial<Quiz>): Promise<{ sucesso: boolean; mensagem: string; quiz?: Quiz }> {
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
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async atualizarQuiz(quizId: string, dadosAtualizacao: Partial<Quiz>): Promise<{ sucesso: boolean; mensagem: string; quiz?: Quiz }> {
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
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async excluirQuiz(quizId: string): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao excluir quiz:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  // Métodos para navegação no quiz
  proximaPergunta(): void {
    const estado = this.estadoQuizSubject.value;
    if (estado && estado.perguntaAtual < estado.quiz.perguntas.length - 1) {
      estado.perguntaAtual++;
      this.estadoQuizSubject.next({ ...estado });
    }
  }

  perguntaAnterior(): void {
    const estado = this.estadoQuizSubject.value;
    if (estado && estado.perguntaAtual > 0 && estado.quiz.configuracoes.permitirVoltarPergunta) {
      estado.perguntaAtual--;
      this.estadoQuizSubject.next({ ...estado });
    }
  }

  irParaPergunta(indice: number): void {
    const estado = this.estadoQuizSubject.value;
    if (estado && indice >= 0 && indice < estado.quiz.perguntas.length) {
      estado.perguntaAtual = indice;
      this.estadoQuizSubject.next({ ...estado });
    }
  }

  // Métodos auxiliares
  calcularTempoGasto(tentativa: TentativaQuiz): number {
    if (!tentativa.dataFinalizacao) return 0;
    
    const inicio = new Date(tentativa.dataInicio).getTime();
    const fim = new Date(tentativa.dataFinalizacao).getTime();
    return Math.round((fim - inicio) / 1000); // em segundos
  }

  obterNotaPercentual(tentativa: TentativaQuiz): number {
    return Math.round((tentativa.pontuacaoTotal / tentativa.pontuacaoMaxima) * 100);
  }

  verificarAprovacao(tentativa: TentativaQuiz, quiz: Quiz): boolean {
    const percentual = this.obterNotaPercentual(tentativa);
    return percentual >= quiz.configuracoes.notaMinima;
  }

  embaralharArray<T>(array: T[]): T[] {
    const arrayEmbaralhado = [...array];
    for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
    }
    return arrayEmbaralhado;
  }

  formatarTempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}min ${segs}s`;
    } else if (minutos > 0) {
      return `${minutos}min ${segs}s`;
    } else {
      return `${segs}s`;
    }
  }

  obterEstatisticasQuiz(quiz: Quiz): any {
    return {
      totalPerguntas: quiz.perguntas.length,
      pontuacaoMaxima: quiz.perguntas.reduce((total, pergunta) => total + pergunta.pontuacao, 0),
      tempoEstimado: quiz.configuracoes.tempoLimite || 'Sem limite',
      dificuldadeMedia: this.calcularDificuldadeMedia(quiz.perguntas),
      categorias: this.obterCategoriasPergunta(quiz.perguntas)
    };
  }

  private calcularDificuldadeMedia(perguntas: Pergunta[]): string {
    const pesos = { facil: 1, medio: 2, dificil: 3 };
    const somaTotal = perguntas.reduce((soma, pergunta) => soma + pesos[pergunta.dificuldade], 0);
    const media = somaTotal / perguntas.length;

    if (media <= 1.5) return 'Fácil';
    if (media <= 2.5) return 'Médio';
    return 'Difícil';
  }

  private obterCategoriasPergunta(perguntas: Pergunta[]): string[] {
    const categorias = new Set<string>();
    perguntas.forEach(pergunta => {
      pergunta.tags.forEach(tag => categorias.add(tag));
    });
    return Array.from(categorias);
  }

  // Método para limpar estado
  limparEstadoQuiz(): void {
    this.estadoQuizSubject.next(null);
  }
}