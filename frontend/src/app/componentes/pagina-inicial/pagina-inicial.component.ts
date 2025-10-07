import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoServico } from '../../servicos/curso.servico';
import { AutenticacaoServico } from '../../servicos/autenticacao.servico';
import { Curso, CategoriaConteudo } from '../../modelos/curso.modelo';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.css']
})
export class PaginaInicialComponent implements OnInit {
  cursosDestaque: Curso[] = [];
  categorias: { nome: string; icone: string; descricao: string; categoria: CategoriaConteudo }[] = [
    {
      nome: 'Lógica de Programação',
      icone: '🧠',
      descricao: 'Fundamentos do pensamento computacional',
      categoria: 'logica-programacao'
    },
    {
      nome: 'HTML, CSS e JavaScript',
      icone: '🌐',
      descricao: 'Tecnologias essenciais para web',
      categoria: 'html-css-javascript'
    },
    {
      nome: 'Angular com TypeScript',
      icone: '⚡',
      descricao: 'Framework moderno para aplicações web',
      categoria: 'angular-typescript'
    },
    {
      nome: 'Versionamento com Git',
      icone: '📝',
      descricao: 'Controle de versão profissional',
      categoria: 'versionamento-git'
    },
    {
      nome: 'Metodologias Ágeis (Scrum)',
      icone: '🚀',
      descricao: 'Gestão ágil de projetos',
      categoria: 'metodologias-ageis'
    },
    {
      nome: 'Banco de Dados',
      icone: '🗄️',
      descricao: 'Modelagem e consultas em bancos de dados',
      categoria: 'banco-dados'
    }
  ];

  estatisticas = {
    totalEstudantes: 0,
    totalCursos: 0,
    totalProfessores: 0,
    horasConteudo: 0
  };

  depoimentos = [
    {
      nome: 'Maria Silva',
      cargo: 'Desenvolvedora Frontend',
      foto: '👩‍💻',
      texto: 'O EduNext transformou minha carreira! Os cursos são práticos e atualizados.',
      nota: 5
    },
    {
      nome: 'João Santos',
      cargo: 'Scrum Master',
      texto: 'Excelente plataforma para aprender metodologias ágeis. Recomendo!',
      foto: '👨‍💼',
      nota: 5
    },
    {
      nome: 'Ana Costa',
      cargo: 'Estudante de TI',
      texto: 'Consegui meu primeiro emprego após completar os cursos de programação.',
      foto: '👩‍🎓',
      nota: 5
    }
  ];

  carregando = true;
  erro = '';

  constructor(
    private cursoServico: CursoServico,
    private autenticacaoServico: AutenticacaoServico,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarDados();
  }

  private async carregarDados(): Promise<void> {
    try {
      this.carregando = true;
      
      // Carregar cursos em destaque
      const cursos = await this.cursoServico.obterCursosDestaque();
      this.cursosDestaque = cursos.slice(0, 3); // Mostrar apenas 3 cursos

      // Carregar estatísticas
      this.estatisticas = await this.cursoServico.obterEstatisticasGerais();
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.erro = 'Erro ao carregar informações. Tente novamente mais tarde.';
    } finally {
      this.carregando = false;
    }
  }

  navegarParaLogin(): void {
    this.router.navigate(['/login']);
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  navegarParaCursos(): void {
    if (this.autenticacaoServico.estaLogado()) {
      this.router.navigate(['/cursos']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  navegarParaCategoria(categoria: CategoriaConteudo): void {
    if (this.autenticacaoServico.estaLogado()) {
      this.router.navigate(['/cursos'], { queryParams: { categoria } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navegarParaCurso(cursoId: string): void {
    if (this.autenticacaoServico.estaLogado()) {
      this.router.navigate(['/curso', cursoId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  get usuarioLogado(): boolean {
    return this.autenticacaoServico.estaLogado();
  }

  get nomeUsuario(): string {
    const usuario = this.autenticacaoServico.obterUsuarioAtual();
    return usuario?.nome || '';
  }

  obterEstrelas(nota: number): string[] {
    return Array(5).fill('⭐').map((_, i) => i < nota ? '⭐' : '☆');
  }

  formatarNumero(numero: number): string {
    if (numero >= 1000) {
      return (numero / 1000).toFixed(1) + 'k';
    }
    return numero.toString();
  }

  scrollParaSecao(secaoId: string): void {
    const elemento = document.getElementById(secaoId);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }
}