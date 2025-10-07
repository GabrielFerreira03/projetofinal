export interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  cursoId: string;
  moduloId?: string;
  categoria: import('./curso.modelo').CategoriaConteudo;
  perguntas: Pergunta[];
  configuracoes: ConfiguracaoQuiz;
  estatisticas: EstatisticaQuiz;
  dataCriacao: Date;
  dataAtualizacao: Date;
  status: 'ativo' | 'inativo' | 'rascunho';
}

export interface ConfiguracaoQuiz {
  tempoLimite?: number; // em minutos
  tentativasMaximas: number;
  embaralharPerguntas: boolean;
  embaralharAlternativas: boolean;
  mostrarResultadoImediato: boolean;
  permitirVoltarPergunta: boolean;
  notaMinima: number; // percentual para aprovação
  mostrarRespostasCorretas: boolean;
  mostrarExplicacoes: boolean;
}

export interface Pergunta {
  id: string;
  enunciado: string;
  tipo: TipoPergunta;
  pontuacao: number;
  ordem: number;
  obrigatoria: boolean;
  imagem?: string;
  video?: string;
  codigo?: CodigoExemplo;
  alternativas?: Alternativa[];
  respostaCorreta?: string | string[] | number;
  explicacao?: string;
  dicas?: string[];
  tags: string[];
  dificuldade: 'facil' | 'medio' | 'dificil';
}

export type TipoPergunta = 
  | 'multipla-escolha'
  | 'verdadeiro-falso'
  | 'dissertativa'
  | 'codigo'
  | 'ordenacao'
  | 'associacao'
  | 'lacunas'
  | 'numerica';

export interface Alternativa {
  id: string;
  texto: string;
  correta: boolean;
  explicacao?: string;
  imagem?: string;
}

export interface CodigoExemplo {
  linguagem: string;
  codigo: string;
  executavel: boolean;
  entrada?: string;
  saidaEsperada?: string;
}

export interface EstatisticaQuiz {
  totalTentativas: number;
  mediaNotas: number;
  maiorNota: number;
  menorNota: number;
  taxaAprovacao: number;
  tempoMedioRealizacao: number;
  perguntasMaisDificeis: string[];
  perguntasMaisFaceis: string[];
}

export interface TentativaQuiz {
  id: string;
  quizId: string;
  estudanteId: string;
  respostas: RespostaTentativa[];
  pontuacaoTotal: number;
  pontuacaoMaxima: number;
  percentual: number;
  aprovado: boolean;
  tempoGasto: number; // em segundos
  dataInicio: Date;
  dataFinalizacao?: Date;
  status: 'em-andamento' | 'finalizada' | 'abandonada';
  tentativa: number;
}

export interface RespostaTentativa {
  perguntaId: string;
  resposta: string | string[] | number;
  correta: boolean;
  pontuacao: number;
  tempoResposta: number; // em segundos
}

export interface ResultadoQuiz {
  tentativa: TentativaQuiz;
  detalhesPerguntas: DetalheResposta[];
  recomendacoes: string[];
  proximosPassos: string[];
}

export interface DetalheResposta {
  pergunta: Pergunta;
  respostaEstudante: string | string[] | number;
  respostaCorreta: string | string[] | number;
  correta: boolean;
  pontuacao: number;
  explicacao?: string;
}

// Interfaces específicas para quizzes por categoria

export interface QuizLogicaProgramacao extends Quiz {
  categoria: 'logica-programacao';
  algoritmos: AlgoritmoTeste[];
  fluxogramas: FluxogramaTeste[];
}

export interface AlgoritmoTeste {
  problema: string;
  entrada: string;
  saidaEsperada: string;
  pseudocodigo?: string;
}

export interface FluxogramaTeste {
  problema: string;
  fluxogramaCorreto: string;
  opcoes: string[];
}

export interface QuizWebBasico extends Quiz {
  categoria: 'html-css-javascript';
  codigosHTML: CodigoTeste[];
  estilosCSS: EstiloTeste[];
  scriptsJS: ScriptTeste[];
}

export interface CodigoTeste {
  problema: string;
  codigoIncompleto: string;
  lacunas: string[];
  respostasCorretas: string[];
}

export interface EstiloTeste {
  elemento: string;
  propriedades: string[];
  valoresCorretos: string[];
  resultado: string;
}

export interface ScriptTeste {
  funcionalidade: string;
  codigo: string;
  entrada: any;
  saidaEsperada: any;
}

export interface QuizAngular extends Quiz {
  categoria: 'angular-typescript';
  componentesTeste: ComponenteTeste[];
  servicosTeste: ServicoTeste[];
  diretivas: DiretivaTeste[];
}

export interface ComponenteTeste {
  nome: string;
  template: string;
  typescript: string;
  funcionalidade: string;
}

export interface ServicoTeste {
  nome: string;
  metodos: string[];
  dependencias: string[];
  uso: string;
}

export interface DiretivaTeste {
  nome: string;
  uso: string;
  efeito: string;
  exemplo: string;
}

export interface QuizGit extends Quiz {
  categoria: 'versionamento-git';
  comandosTeste: ComandoTeste[];
  cenarios: CenarioGit[];
}

export interface ComandoTeste {
  situacao: string;
  comandoCorreto: string;
  opcoes: string[];
  resultado: string;
}

export interface CenarioGit {
  contexto: string;
  problema: string;
  solucao: string[];
  comandos: string[];
}

export interface QuizScrum extends Quiz {
  categoria: 'metodologias-ageis';
  situacoesPraticas: SituacaoScrum[];
  ceremoniasTeste: CerimoniaTeste[];
}

export interface SituacaoScrum {
  contexto: string;
  problema: string;
  opcoesSolucao: string[];
  solucaoCorreta: string;
  justificativa: string;
}

export interface CerimoniaTeste {
  cerimonia: string;
  situacao: string;
  acaoCorreta: string;
  opcoes: string[];
}

export interface QuizBancoDados extends Quiz {
  categoria: 'banco-dados';
  exerciciosSQL: ExercicioSQLQuiz[];
  conceitosTeste: ConceitoTeste[];
}

export interface ExercicioSQLQuiz {
  cenario: string;
  problema: string;
  tabelasEnvolvidas: string[];
  comandoCorreto: string;
  conceitosAplicaveis: string[];
  dificuldade: 'facil' | 'medio' | 'dificil';
}

export interface ConceitoTeste {
  conceito: string;
  situacao: string;
  aplicavel: boolean;
  explicacao: string;
}