import { Component, OnInit } from '@angular/core';
import { CursosService, Curso } from '../../services/cursos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listagem-cursos',
  templateUrl: './listagem-cursos.component.html'
})
export class ListagemCursosComponent implements OnInit {
  cursos: Curso[] = [];
  cursosMatriculados: Curso[] = [];
  loading = true;
  error = '';
  userType = '';
  searchTerm = '';

  constructor(
    private cursosService: CursosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userType = user.tipo;
        this.loadCursos();
      }
    });
  }

  loadCursos(): void {
    this.loading = true;
    
    // Carregar todos os cursos
    this.cursosService.listarCursos().subscribe(
      (cursos) => {
        this.cursos = cursos;
        
        // Se for estudante, carregar cursos matriculados
        if (this.userType === 'estudante') {
          this.cursosService.listarCursosMatriculados().subscribe(
            (matriculados) => {
              this.cursosMatriculados = matriculados;
              this.loading = false;
            },
            (error) => {
              this.error = 'Erro ao carregar cursos matriculados';
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
        }
      },
      (error) => {
        this.error = 'Erro ao carregar cursos';
        this.loading = false;
      }
    );
  }

  isMatriculado(cursoId: string): boolean {
    return this.cursosMatriculados.some(curso => curso.id === cursoId);
  }

  matricular(cursoId: string): void {
    this.loading = true;
    this.cursosService.matricularEstudante(cursoId).subscribe(
      () => {
        // Adicionar curso à lista de matriculados
        const curso = this.cursos.find(c => c.id === cursoId);
        if (curso) {
          this.cursosMatriculados.push(curso);
        }
        this.loading = false;
      },
      (error) => {
        this.error = 'Erro ao matricular no curso';
        this.loading = false;
      }
    );
  }

  get cursosFiltrados(): Curso[] {
    if (!this.searchTerm) {
      return this.cursos;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.cursos.filter(curso => 
      curso.titulo.toLowerCase().includes(term) || 
      curso.descricao.toLowerCase().includes(term)
    );
  }
}