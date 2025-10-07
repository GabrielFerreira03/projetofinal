import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Curso, 
  CategoriaConteudo, 
  Modulo, 
  Conteudo,
  CursoLogicaProgramacao,
  CursoWebBasico,
  CursoAngular,
  CursoGit,
  CursoScrum,
  CursoBancoDados
} from '../modelos/curso.modelo';
import { AutenticacaoServico } from './autenticacao.servico';

export interface FiltrosCurso {
  categoria?: CategoriaConteudo;
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  preco?: 'gratuito' | 'pago';
  duracao?: 'curta' | 'media' | 'longa'; // < 10h, 10-30h, > 30h
  avaliacao?: number; // mínima
  busca?: string;
}

export interface ProgressoCurso {
  cursoId: string;
  estudanteId: string;
  percentualConcluido: number;
  modulosCompletados: string[];
  conteudosVisualizados: string[];
  quizzesRealizados: string[];
  ultimoAcesso: Date;
  tempoTotalEstudo: number; // em minutos
  certificadoEmitido: boolean;
}

export interface EstatisticasCurso {
  totalEstudantes: number;
  avaliacaoMedia: number;
  taxaConclusao: number;
  tempoMedioEstudo: number;
  moduloMaisDificil: string;
  conteudoMaisAcessado: string;
}

@Injectable({
  providedIn: 'root'
})
export class CursoServico {
  private readonly API_URL = 'http://localhost:3000/api';
  private cursosSubject = new BehaviorSubject<Curso[]>([]);
  private cursoAtualSubject = new BehaviorSubject<Curso | null>(null);
  private progressoSubject = new BehaviorSubject<ProgressoCurso[]>([]);

  public cursos$ = this.cursosSubject.asObservable();
  public cursoAtual$ = this.cursoAtualSubject.asObservable();
  public progresso$ = this.progressoSubject.asObservable();

  constructor(private autenticacaoServico: AutenticacaoServico) {}

  // Métodos para obter cursos
  async obterTodosCursos(filtros?: FiltrosCurso): Promise<Curso[]> {
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
      } else {
        throw new Error('Erro ao carregar cursos');
      }
    } catch (error) {
      console.error('Erro ao obter cursos:', error);
      return [];
    }
  }

  async obterCursoPorId(id: string): Promise<Curso | null> {
    try {
      const response = await fetch(`${this.API_URL}/cursos/${id}`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        this.cursoAtualSubject.next(data.curso);
        return data.curso;
      } else {
        throw new Error('Curso não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter curso:', error);
      return null;
    }
  }

  async obterCursosDestaque(): Promise<Curso[]> {
    try {
      const response = await fetch(`${this.API_URL}/cursos/destaque`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.cursos || [];
      } else {
        throw new Error('Erro ao carregar cursos em destaque');
      }
    } catch (error) {
      console.error('Erro ao obter cursos em destaque:', error);
      return [];
    }
  }

  async obterCursosPorCategoria(categoria: CategoriaConteudo): Promise<Curso[]> {
    return this.obterTodosCursos({ categoria });
  }

  async obterCursosDoEstudante(): Promise<Curso[]> {
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
      } else {
        throw new Error('Erro ao carregar cursos do estudante');
      }
    } catch (error) {
      console.error('Erro ao obter cursos do estudante:', error);
      return [];
    }
  }

  async obterCursosDoProfessor(): Promise<Curso[]> {
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
      } else {
        throw new Error('Erro ao carregar cursos do professor');
      }
    } catch (error) {
      console.error('Erro ao obter cursos do professor:', error);
      return [];
    }
  }

  // Métodos para gerenciar inscrições
  async inscreverNoCurso(cursoId: string): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao inscrever no curso:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async verificarInscricao(cursoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/cursos/${cursoId}/inscricao`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.inscrito || false;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
      return false;
    }
  }

  // Métodos para progresso
  async obterProgressoCurso(cursoId: string): Promise<ProgressoCurso | null> {
    try {
      const response = await fetch(`${this.API_URL}/cursos/${cursoId}/progresso`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.progresso;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter progresso:', error);
      return null;
    }
  }

  async marcarConteudoComoVisto(cursoId: string, conteudoId: string): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao marcar conteúdo como visto:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async obterTodoProgresso(): Promise<ProgressoCurso[]> {
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
    } catch (error) {
      console.error('Erro ao obter todo progresso:', error);
      return [];
    }
  }

  // Métodos para professores
  async criarCurso(dadosCurso: Partial<Curso>): Promise<{ sucesso: boolean; mensagem: string; curso?: Curso }> {
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
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async atualizarCurso(cursoId: string, dadosAtualizacao: Partial<Curso>): Promise<{ sucesso: boolean; mensagem: string; curso?: Curso }> {
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
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async excluirCurso(cursoId: string): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  // Métodos para estatísticas
  async obterEstatisticasCurso(cursoId: string): Promise<EstatisticasCurso | null> {
    try {
      const response = await fetch(`${this.API_URL}/cursos/${cursoId}/estatisticas`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.estatisticas;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter estatísticas do curso:', error);
      return null;
    }
  }

  async obterEstatisticasGerais(): Promise<{ totalEstudantes: number; totalCursos: number; totalProfessores: number; horasConteudo: number }> {
    try {
      const response = await fetch(`${this.API_URL}/estatisticas/gerais`, {
        headers: this.autenticacaoServico.obterHeadersAutenticados()
      });

      if (response.ok) {
        const data = await response.json();
        return data.estatisticas || { totalEstudantes: 0, totalCursos: 0, totalProfessores: 0, horasConteudo: 0 };
      }
      return { totalEstudantes: 0, totalCursos: 0, totalProfessores: 0, horasConteudo: 0 };
    } catch (error) {
      console.error('Erro ao obter estatísticas gerais:', error);
      return { totalEstudantes: 0, totalCursos: 0, totalProfessores: 0, horasConteudo: 0 };
    }
  }

  // Métodos para avaliações
  async avaliarCurso(cursoId: string, nota: number, comentario: string): Promise<{ sucesso: boolean; mensagem: string }> {
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
    } catch (error) {
      console.error('Erro ao avaliar curso:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  // Métodos para certificados
  async gerarCertificado(cursoId: string): Promise<{ sucesso: boolean; mensagem: string; certificado?: any }> {
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
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  // Métodos auxiliares
  calcularProgressoPercentual(progresso: ProgressoCurso, curso: Curso): number {
    if (!curso.modulos || curso.modulos.length === 0) return 0;

    const totalConteudos = curso.modulos.reduce((total, modulo) => 
      total + (modulo.conteudos?.length || 0), 0);
    
    if (totalConteudos === 0) return 0;

    const conteudosVisualizados = progresso.conteudosVisualizados?.length || 0;
    return Math.round((conteudosVisualizados / totalConteudos) * 100);
  }

  obterProximoConteudo(curso: Curso, progresso: ProgressoCurso): { modulo: Modulo; conteudo: Conteudo } | null {
    for (const modulo of curso.modulos) {
      for (const conteudo of modulo.conteudos) {
        if (!progresso.conteudosVisualizados.includes(conteudo.id)) {
          return { modulo, conteudo };
        }
      }
    }
    return null;
  }

  formatarDuracao(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  }
}