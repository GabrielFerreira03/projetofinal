export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'estudante' | 'professor';
  dataCriacao: Date;
  ultimoAcesso?: Date;
  perfil?: PerfilUsuario;
}

export interface PerfilUsuario {
  foto?: string;
  biografia?: string;
  telefone?: string;
  endereco?: Endereco;
  redesSociais?: RedesSociais;
  configuracoes?: ConfiguracoesUsuario;
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

export interface RedesSociais {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

export interface ConfiguracoesUsuario {
  notificacoesPorEmail: boolean;
  notificacoesPush: boolean;
  privacidadePerfil: 'publico' | 'privado' | 'amigos';
  tema: 'claro' | 'escuro' | 'automatico';
  idioma: string;
}

export interface Estudante extends Usuario {
  tipo: 'estudante';
  cursosMatriculados: string[]; // IDs dos cursos
  progressoCursos: ProgressoCurso[];
  certificados: Certificado[];
  pontuacaoTotal: number;
}

export interface Professor extends Usuario {
  tipo: 'professor';
  especialidades: string[];
  cursosMinistrados: string[]; // IDs dos cursos
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  biografia: string;
  formacao: Formacao[];
  experiencia: Experiencia[];
}

export interface ProgressoCurso {
  cursoId: string;
  percentualConcluido: number;
  modulosCompletados: string[];
  conteudosVisualizados: string[];
  quizzesRealizados: QuizRealizado[];
  tempoTotalEstudo: number; // em minutos
  ultimaAtividade: Date;
}

export interface QuizRealizado {
  quizId: string;
  pontuacao: number;
  pontuacaoMaxima: number;
  tentativas: number;
  dataRealizacao: Date;
  tempoGasto: number; // em segundos
}

export interface Certificado {
  id: string;
  cursoId: string;
  nomeCurso: string;
  dataEmissao: Date;
  codigoVerificacao: string;
  url: string;
}

export interface Formacao {
  instituicao: string;
  curso: string;
  nivel: 'tecnico' | 'graduacao' | 'pos-graduacao' | 'mestrado' | 'doutorado';
  anoInicio: number;
  anoConclusao?: number;
  status: 'concluido' | 'em-andamento' | 'trancado';
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date;
  atual: boolean;
}