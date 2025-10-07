import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  nivel: string;
  preco: number;
  professorId: string;
  modulos?: Modulo[];
}

export interface Modulo {
  id: string;
  titulo: string;
  ordem: number;
  conteudos?: Conteudo[];
}

export interface Conteudo {
  id: string;
  titulo: string;
  tipo: string;
  url: string;
}

export interface Quiz {
  id: string;
  titulo: string;
  perguntas: Pergunta[];
}

export interface Pergunta {
  texto: string;
  opcoes: string[];
  respostaCorreta: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  listarCursos(filtros?: any): Observable<Curso[]> {
    let url = `${this.apiUrl}/cursos`;
    
    if (filtros) {
      const params = new URLSearchParams();
      
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.nivel) params.append('nivel', filtros.nivel);
      if (filtros.preco) params.append('preco', filtros.preco);
      
      url += `?${params.toString()}`;
    }
    
    return this.http.get<Curso[]>(url);
  }
  
  obterCurso(id: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/cursos/${id}`);
  }
  
  criarCurso(curso: Partial<Curso>): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos`, curso);
  }
  
  atualizarCurso(id: string, curso: Partial<Curso>): Observable<any> {
    return this.http.put(`${this.apiUrl}/cursos/${id}`, curso);
  }
  
  removerCurso(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cursos/${id}`);
  }
  
  inscreverEmCurso(cursoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/estudantes/cursos/${cursoId}/inscrever`, {});
  }
  
  listarCursosInscritos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/estudantes/cursos`);
  }
  
  listarCursosProfessor(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/professores/cursos`);
  }
  
  obterEstatisticasCurso(cursoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/professores/cursos/${cursoId}/estatisticas`);
  }
  
  criarQuiz(cursoId: string, quiz: Partial<Quiz>): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos/${cursoId}/quizzes`, quiz);
  }
  
  responderQuiz(cursoId: string, quizId: string, respostas: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos/${cursoId}/quizzes/${quizId}/responder`, { respostas });
  }
  
  obterProgressoEstudante(cursoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/estudantes/progresso/${cursoId}`);
  }
  
  marcarConteudoConcluido(cursoId: string, conteudoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/estudantes/progresso/${cursoId}/conteudo/${conteudoId}`, {});
  }
}