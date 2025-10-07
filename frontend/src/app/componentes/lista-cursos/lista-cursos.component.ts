import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CursoServico, FiltrosCurso } from '../../servicos/curso.servico';
import { AutenticacaoServico } from '../../servicos/autenticacao.servico';
import { Curso, CategoriaConteudo } from '../../modelos/curso.modelo';
import { Usuario } from '../../modelos/usuario.modelo';

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.css']
})
export class ListaCursosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cursos: Curso[] = [];
  cursosCarregando = false;
  usuarioLogado: Usuario | null = null;
  
  // Filtros
  filtros: FiltrosCurso = {};
  termoPesquisa = '';
  categoriaAtiva: CategoriaConteudo | 'todas' = 'todas';
  nivelAtivo: 'todos' | 'iniciante' | 'intermediario' | 'avancado' = 'todos';
  ordenacaoAtiva: 'relevancia' | 'data' | 'popularidade' | 'avaliacao' = 'relevancia';
  
  // Paginação
  paginaAtual = 1;
  itensPorPagina = 12;
  totalItens = 0;
  totalPaginas = 0;

  // Categorias de conteúdo formativo
  categorias = [
    { 
      nome: 'Todas', 
      valor: 'todas' as const, 
      icone: '📚', 
      cor: '#6366f1',
      descricao: 'Todos os cursos disponíveis'
    },
    { 
      nome: 'Lógica de Programação', 
      valor: 'logica-programacao' as CategoriaConteudo, 
      icone: '🧠', 
      cor: '#8b5cf6',
      descricao: 'Fundamentos da programação e algoritmos'
    },
    { 
      nome: 'HTML, CSS e JavaScript', 
      valor: 'web-basico' as CategoriaConteudo, 
      icone: '🌐', 
      cor: '#06b6d4',
      descricao: 'Desenvolvimento web front-end básico'
    },
    { 
      nome: 'Angular com TypeScript', 
      valor: 'angular' as CategoriaConteudo, 
      icone: '🅰️', 
      cor: '#dc2626',
      descricao: 'Framework Angular e TypeScript'
    },
    { 
      nome: 'Versionamento com Git', 
      valor: 'git' as CategoriaConteudo, 
      icone: '📚', 
      cor: '#f59e0b',
      descricao: 'Controle de versão e colaboração'
    },
    { 
      nome: 'Metodologias Ágeis (Scrum)', 
      valor: 'scrum' as CategoriaConteudo, 
      icone: '⚡', 
      cor: '#10b981',
      descricao: 'Gestão ágil de projetos'
    },
    { 
      nome: 'Banco de Dados', 
      valor: 'banco-dados' as CategoriaConteudo, 
      icone: '🗄️', 
      cor: '#6b7280',
      descricao: 'Modelagem e consultas em bancos de dados'
    }
  ];

  niveis = [
    { nome: 'Todos os níveis', valor: 'todos' as const },
    { nome: 'Iniciante', valor: 'iniciante' as const },
    { nome: 'Intermediário', valor: 'intermediario' as const },
    { nome: 'Avançado', valor: 'avancado' as const }
  ];

  opcesOrdenacao = [
    { nome: 'Relevância', valor: 'relevancia' as const },
    { nome: 'Mais recentes', valor: 'data' as const },
    { nome: 'Mais populares', valor: 'popularidade' as const },
    { nome: 'Melhor avaliados', valor: 'avaliacao' as const }
  ];

  constructor(
    private cursoServico: CursoServico,
    private autenticacaoServico: AutenticacaoServico,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Observar usuário logado
    this.autenticacaoServico.usuarioLogado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuarioLogado = usuario;
      });

    // Observar parâmetros da rota
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.aplicarParametrosRota(params);
        this.carregarCursos();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private aplicarParametrosRota(params: any): void {
    this.termoPesquisa = params['pesquisa'] || '';
    this.categoriaAtiva = params['categoria'] || 'todas';
    this.nivelAtivo = params['nivel'] || 'todos';
    this.ordenacaoAtiva = params['ordenacao'] || 'relevancia';
    this.paginaAtual = parseInt(params['pagina']) || 1;

    this.atualizarFiltros();
  }

  private atualizarFiltros(): void {
    this.filtros = {
      pesquisa: this.termoPesquisa || undefined,
      categoria: this.categoriaAtiva !== 'todas' ? this.categoriaAtiva : undefined,
      nivel: this.nivelAtivo !== 'todos' ? this.nivelAtivo : undefined,
      ordenacao: this.ordenacaoAtiva,
      pagina: this.paginaAtual,
      limite: this.itensPorPagina
    };
  }

  async carregarCursos(): Promise<void> {
    this.cursosCarregando = true;
    
    try {
      const resultado = await this.cursoServico.obterCursos(this.filtros);
      this.cursos = resultado.cursos;
      this.totalItens = resultado.total;
      this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      this.cursos = [];
      this.totalItens = 0;
      this.totalPaginas = 0;
    } finally {
      this.cursosCarregando = false;
    }
  }

  filtrarPorCategoria(categoria: CategoriaConteudo | 'todas'): void {
    this.categoriaAtiva = categoria;
    this.paginaAtual = 1;
    this.atualizarURL();
  }

  filtrarPorNivel(nivel: 'todos' | 'iniciante' | 'intermediario' | 'avancado'): void {
    this.nivelAtivo = nivel;
    this.paginaAtual = 1;
    this.atualizarURL();
  }

  alterarOrdenacao(ordenacao: 'relevancia' | 'data' | 'popularidade' | 'avaliacao'): void {
    this.ordenacaoAtiva = ordenacao;
    this.paginaAtual = 1;
    this.atualizarURL();
  }

  pesquisar(): void {
    this.paginaAtual = 1;
    this.atualizarURL();
  }

  limparFiltros(): void {
    this.termoPesquisa = '';
    this.categoriaAtiva = 'todas';
    this.nivelAtivo = 'todos';
    this.ordenacaoAtiva = 'relevancia';
    this.paginaAtual = 1;
    this.atualizarURL();
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.atualizarURL();
    }
  }

  private atualizarURL(): void {
    const queryParams: any = {};
    
    if (this.termoPesquisa) queryParams.pesquisa = this.termoPesquisa;
    if (this.categoriaAtiva !== 'todas') queryParams.categoria = this.categoriaAtiva;
    if (this.nivelAtivo !== 'todos') queryParams.nivel = this.nivelAtivo;
    if (this.ordenacaoAtiva !== 'relevancia') queryParams.ordenacao = this.ordenacaoAtiva;
    if (this.paginaAtual > 1) queryParams.pagina = this.paginaAtual;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  async inscreverNoCurso(curso: Curso): Promise<void> {
    if (!this.usuarioLogado) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/cursos/${curso.id}` }
      });
      return;
    }

    try {
      const resultado = await this.cursoServico.inscreverNoCurso(curso.id);
      if (resultado.sucesso) {
        // Atualizar status do curso
        curso.inscrito = true;
        // Mostrar mensagem de sucesso
        console.log('Inscrição realizada com sucesso!');
      } else {
        console.error('Erro na inscrição:', resultado.mensagem);
      }
    } catch (error) {
      console.error('Erro ao se inscrever no curso:', error);
    }
  }

  navegarParaCurso(curso: Curso): void {
    this.router.navigate(['/cursos', curso.id]);
  }

  obterCategoriaInfo(categoria: CategoriaConteudo) {
    return this.categorias.find(cat => cat.valor === categoria);
  }

  formatarDuracao(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${mins > 0 ? mins + 'min' : ''}`;
    }
    return `${mins}min`;
  }

  formatarPreco(preco: number): string {
    if (preco === 0) return 'Gratuito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }

  obterEstrelas(avaliacao: number): string[] {
    const estrelas = [];
    const avaliacaoArredondada = Math.round(avaliacao * 2) / 2;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= avaliacaoArredondada) {
        estrelas.push('★');
      } else if (i - 0.5 <= avaliacaoArredondada) {
        estrelas.push('☆');
      } else {
        estrelas.push('☆');
      }
    }
    
    return estrelas;
  }

  obterPaginasVisiveis(): number[] {
    const paginas = [];
    const inicio = Math.max(1, this.paginaAtual - 2);
    const fim = Math.min(this.totalPaginas, this.paginaAtual + 2);
    
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  onKeydownPesquisa(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.pesquisar();
    }
  }
}