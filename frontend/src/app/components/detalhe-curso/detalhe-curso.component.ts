import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursosService, Curso, Modulo, Conteudo } from '../../services/cursos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detalhe-curso',
  templateUrl: './detalhe-curso.component.html'
})
export class DetalheCursoComponent implements OnInit {
  curso: Curso | null = null;
  moduloAtivo: Modulo | null = null;
  conteudoAtivo: Conteudo | null = null;
  loading = true;
  error = '';
  userType = '';
  progresso: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private cursosService: CursosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userType = user.tipo;
        this.carregarCurso();
      }
    });
  }

  carregarCurso(): void {
    const cursoId = this.route.snapshot.paramMap.get('id');
    if (!cursoId) {
      this.error = 'ID do curso não encontrado';
      this.loading = false;
      return;
    }

    this.cursosService.obterCurso(cursoId).subscribe(
      (curso) => {
        this.curso = curso;
        
        // Selecionar primeiro módulo por padrão se existir
        if (curso.modulos && curso.modulos.length > 0) {
          this.selecionarModulo(curso.modulos[0]);
        }
        
        // Se for estudante, carregar progresso
        if (this.userType === 'estudante') {
          this.carregarProgresso(cursoId);
        } else {
          this.loading = false;
        }
      },
      (error) => {
        this.error = 'Erro ao carregar detalhes do curso';
        this.loading = false;
      }
    );
  }

  carregarProgresso(cursoId: string): void {
    this.cursosService.obterProgressoEstudante(cursoId).subscribe(
      (progresso) => {
        this.progresso = progresso;
        this.loading = false;
      },
      (error) => {
        this.error = 'Erro ao carregar progresso do curso';
        this.loading = false;
      }
    );
  }

  selecionarModulo(modulo: Modulo): void {
    this.moduloAtivo = modulo;
    
    // Selecionar primeiro conteúdo por padrão se existir
    if (modulo.conteudos && modulo.conteudos.length > 0) {
      this.selecionarConteudo(modulo.conteudos[0]);
    } else {
      this.conteudoAtivo = null;
    }
  }

  selecionarConteudo(conteudo: Conteudo): void {
    this.conteudoAtivo = conteudo;
    
    // Se for estudante, marcar conteúdo como visualizado
    if (this.userType === 'estudante' && this.curso) {
      this.marcarComoVisualizado(this.curso.id, this.moduloAtivo?.id || '', conteudo.id);
    }
  }

  marcarComoVisualizado(cursoId: string, moduloId: string, conteudoId: string): void {
    this.cursosService.marcarConteudoComoVisualizado(cursoId, moduloId, conteudoId).subscribe(
      () => {
        // Atualizar progresso local
        if (!this.progresso.conteudosVisualizados) {
          this.progresso.conteudosVisualizados = [];
        }
        if (!this.progresso.conteudosVisualizados.includes(conteudoId)) {
          this.progresso.conteudosVisualizados.push(conteudoId);
        }
      },
      (error) => {
        console.error('Erro ao marcar conteúdo como visualizado', error);
      }
    );
  }

  conteudoVisualizado(conteudoId: string): boolean {
    return this.progresso && 
           this.progresso.conteudosVisualizados && 
           this.progresso.conteudosVisualizados.includes(conteudoId);
  }

  calcularProgressoModulo(modulo: Modulo): number {
    if (!modulo.conteudos || modulo.conteudos.length === 0 || !this.progresso.conteudosVisualizados) {
      return 0;
    }
    
    const total = modulo.conteudos.length;
    const visualizados = modulo.conteudos.filter(c => 
      this.progresso.conteudosVisualizados.includes(c.id)
    ).length;
    
    return Math.round((visualizados / total) * 100);
  }

  calcularProgressoCurso(): number {
    if (!this.curso || !this.curso.modulos || !this.progresso.conteudosVisualizados) {
      return 0;
    }
    
    const totalConteudos = this.curso.modulos.reduce(
      (total, modulo) => total + (modulo.conteudos ? modulo.conteudos.length : 0), 
      0
    );
    
    if (totalConteudos === 0) {
      return 0;
    }
    
    return Math.round((this.progresso.conteudosVisualizados.length / totalConteudos) * 100);
  }
}