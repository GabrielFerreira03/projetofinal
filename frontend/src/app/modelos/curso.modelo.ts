export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaConteudo;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // em horas
  professor: {
    id: string;
    nome: string;
    foto?: string;
  };
  modulos: Modulo[];
  preco: number;
  promocao?: Promocao;
  avaliacoes: Avaliacao[];
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  totalEstudantes: number;
  imagemCapa: string;
  tags: string[];
  prerequisitos: string[];
  objetivos: string[];
  dataCriacao: Date;
  dataAtualizacao: Date;
  status: 'rascunho' | 'publicado' | 'arquivado';
  certificado: boolean;
}

export type CategoriaConteudo = 
  | 'logica-programacao'
  | 'html-css-javascript'
  | 'angular-typescript'
  | 'versionamento-git'
  | 'metodologias-ageis'
  | 'banco-dados';

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  duracao: number; // em minutos
  conteudos: Conteudo[];
  quiz?: string; // ID do quiz do módulo
  liberado: boolean;
}

export interface Conteudo {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoConteudo;
  ordem: number;
  duracao: number; // em minutos
  url?: string;
  arquivo?: ArquivoConteudo;
  transcricao?: string;
  legendas?: Legenda[];
  recursos?: RecursoAdicional[];
  exercicios?: Exercicio[];
}

export type TipoConteudo = 
  | 'video'
  | 'texto'
  | 'pdf'
  | 'apresentacao'
  | 'codigo'
  | 'exercicio-pratico'
  | 'projeto'
  | 'quiz';

export interface ArquivoConteudo {
  nome: string;
  tamanho: number;
  tipo: string;
  url: string;
  downloadPermitido: boolean;
}

export interface Legenda {
  idioma: string;
  url: string;
}

export interface RecursoAdicional {
  titulo: string;
  descricao: string;
  tipo: 'link' | 'arquivo' | 'ferramenta';
  url: string;
}

export interface Exercicio {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'codigo' | 'multipla-escolha' | 'dissertativo' | 'pratico';
  pontuacao: number;
  solucao?: string;
  dicas?: string[];
}

export interface Promocao {
  desconto: number; // percentual
  dataInicio: Date;
  dataFim: Date;
  codigo?: string;
  ativa: boolean;
}

export interface Avaliacao {
  id: string;
  estudanteId: string;
  nomeEstudante: string;
  nota: number; // 1-5
  comentario: string;
  dataAvaliacao: Date;
  util: number; // quantas pessoas acharam útil
}

// Interfaces específicas para os conteúdos formativos

export interface CursoLogicaProgramacao extends Curso {
  categoria: 'logica-programacao';
  ferramentasUtilizadas: ('scratch' | 'flowchart' | 'pseudocodigo' | 'python')[];
  conceitos: ConceptoLogica[];
}

export interface ConceptoLogica {
  nome: string;
  descricao: string;
  exemplos: string[];
  exercicios: string[];
}

export interface CursoWebBasico extends Curso {
  categoria: 'html-css-javascript';
  tecnologias: ('html5' | 'css3' | 'javascript' | 'bootstrap' | 'responsive')[];
  projetos: ProjetoWeb[];
}

export interface ProjetoWeb {
  nome: string;
  descricao: string;
  tecnologiasUsadas: string[];
  dificuldade: 'facil' | 'medio' | 'dificil';
  tempoEstimado: number;
  repositorio?: string;
  demo?: string;
}

export interface CursoAngular extends Curso {
  categoria: 'angular-typescript';
  versaoAngular: string;
  conceitos: ConceptoAngular[];
  bibliotecas: string[];
}

export interface ConceptoAngular {
  nome: string;
  descricao: string;
  codigoExemplo: string;
  documentacao: string;
}

export interface CursoGit extends Curso {
  categoria: 'versionamento-git';
  comandos: ComandoGit[];
  fluxosTrabalho: FluxoGit[];
}

export interface ComandoGit {
  comando: string;
  descricao: string;
  exemplo: string;
  categoria: 'basico' | 'intermediario' | 'avancado';
}

export interface FluxoGit {
  nome: string;
  descricao: string;
  passos: string[];
  cenarioUso: string;
}

export interface CursoScrum extends Curso {
  categoria: 'metodologias-ageis';
  ceremonias: CerimoniaScrum[];
  artefatos: ArtefatoScrum[];
  papeis: PapelScrum[];
}

export interface CerimoniaScrum {
  nome: string;
  objetivo: string;
  duracao: string;
  participantes: string[];
  entradas: string[];
  saidas: string[];
}

export interface ArtefatoScrum {
  nome: string;
  descricao: string;
  responsavel: string;
  quando: string;
}

export interface PapelScrum {
  nome: string;
  responsabilidades: string[];
  habilidades: string[];
}

export interface CursoBancoDados extends Curso {
  categoria: 'banco-dados';
  conceitos: ConceitoBancoDados[];
  exerciciosSQL: ExercicioSQL[];
  ferramentasBD: FerramentaBancoDados[];
}

export interface ConceitoBancoDados {
  nome: string;
  titulo: string;
  descricao: string;
  exemplos: string[];
  comandosSQL: string[];
}

export interface ExercicioSQL {
  titulo: string;
  contexto: string;
  problema: string;
  solucaoSQL: string;
  conceitosRelacionados: string[];
}

export interface FerramentaBancoDados {
  nome: string;
  descricao: string;
  categoria: 'sgbd' | 'modelagem' | 'administracao' | 'consulta';
  url?: string;
}