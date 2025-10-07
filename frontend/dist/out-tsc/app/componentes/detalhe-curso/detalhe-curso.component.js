import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
let DetalheCursoComponent = class DetalheCursoComponent {
    constructor(route, router, cursoServico, autenticacaoServico) {
        this.route = route;
        this.router = router;
        this.cursoServico = cursoServico;
        this.autenticacaoServico = autenticacaoServico;
        this.curso = null;
        this.usuarioAtual = null;
        this.carregando = true;
        this.erro = null;
        // Estados da interface
        this.moduloExpandido = null;
        this.mostrarAvaliacoes = false;
        this.mostrarFormularioAvaliacao = false;
        // Dados de matrícula
        this.jaMatriculado = false;
        this.progressoCurso = null;
        // Formulário de avaliação
        this.novaAvaliacao = {
            nota: 5,
            comentario: '',
            recomenda: true
        };
        // Dados de exibição
        this.avaliacoes = [];
        this.estatisticasAvaliacoes = {
            media: 0,
            total: 0,
            distribuicao: [0, 0, 0, 0, 0]
        };
        this.subscriptions = [];
    }
    ngOnInit() {
        this.verificarUsuario();
        this.carregarCurso();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    verificarUsuario() {
        this.usuarioAtual = this.autenticacaoServico.obterUsuarioAtual();
    }
    carregarCurso() {
        const cursoId = this.route.snapshot.paramMap.get('id');
        if (!cursoId) {
            this.erro = 'ID do curso não encontrado';
            this.carregando = false;
            return;
        }
        this.carregando = true;
        const sub = this.cursoServico.obterCursoPorId(cursoId).subscribe({
            next: (curso) => {
                this.curso = curso;
                this.verificarMatricula();
                this.carregarAvaliacoes();
                this.carregando = false;
            },
            error: (erro) => {
                console.error('Erro ao carregar curso:', erro);
                this.erro = 'Erro ao carregar detalhes do curso';
                this.carregando = false;
            }
        });
        this.subscriptions.push(sub);
    }
    verificarMatricula() {
        if (!this.usuarioAtual || !this.curso)
            return;
        const sub = this.cursoServico.verificarMatricula(this.curso.id, this.usuarioAtual.id).subscribe({
            next: (matriculado) => {
                this.jaMatriculado = matriculado;
                if (matriculado) {
                    this.carregarProgresso();
                }
            },
            error: (erro) => {
                console.error('Erro ao verificar matrícula:', erro);
            }
        });
        this.subscriptions.push(sub);
    }
    carregarProgresso() {
        if (!this.usuarioAtual || !this.curso)
            return;
        const sub = this.cursoServico.obterProgressoCurso(this.curso.id, this.usuarioAtual.id).subscribe({
            next: (progresso) => {
                this.progressoCurso = progresso;
            },
            error: (erro) => {
                console.error('Erro ao carregar progresso:', erro);
            }
        });
        this.subscriptions.push(sub);
    }
    carregarAvaliacoes() {
        if (!this.curso)
            return;
        const sub = this.cursoServico.obterAvaliacoesCurso(this.curso.id).subscribe({
            next: (avaliacoes) => {
                this.avaliacoes = avaliacoes;
                this.calcularEstatisticasAvaliacoes();
            },
            error: (erro) => {
                console.error('Erro ao carregar avaliações:', erro);
            }
        });
        this.subscriptions.push(sub);
    }
    calcularEstatisticasAvaliacoes() {
        if (this.avaliacoes.length === 0) {
            this.estatisticasAvaliacoes = {
                media: 0,
                total: 0,
                distribuicao: [0, 0, 0, 0, 0]
            };
            return;
        }
        const total = this.avaliacoes.length;
        const soma = this.avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
        const media = soma / total;
        const distribuicao = [0, 0, 0, 0, 0];
        this.avaliacoes.forEach(avaliacao => {
            distribuicao[avaliacao.nota - 1]++;
        });
        this.estatisticasAvaliacoes = {
            media: Math.round(media * 10) / 10,
            total,
            distribuicao
        };
    }
    // Métodos de interação
    matricularNoCurso() {
        if (!this.usuarioAtual || !this.curso) {
            this.router.navigate(['/login']);
            return;
        }
        const sub = this.cursoServico.matricularUsuario(this.curso.id, this.usuarioAtual.id).subscribe({
            next: () => {
                this.jaMatriculado = true;
                this.carregarProgresso();
                alert('Matrícula realizada com sucesso!');
            },
            error: (erro) => {
                console.error('Erro ao matricular:', erro);
                alert('Erro ao realizar matrícula. Tente novamente.');
            }
        });
        this.subscriptions.push(sub);
    }
    continuarCurso() {
        if (!this.curso)
            return;
        // Navegar para o primeiro módulo não concluído ou primeiro módulo
        const proximoModulo = this.obterProximoModulo();
        if (proximoModulo) {
            this.router.navigate(['/curso', this.curso.id, 'modulo', proximoModulo.id]);
        }
    }
    obterProximoModulo() {
        if (!this.curso || !this.curso.modulos)
            return null;
        // Se não há progresso, retorna o primeiro módulo
        if (!this.progressoCurso) {
            return this.curso.modulos[0] || null;
        }
        // Encontra o primeiro módulo não concluído
        for (const modulo of this.curso.modulos) {
            const moduloProgresso = this.progressoCurso.modulosCompletados?.find((m) => m.moduloId === modulo.id);
            if (!moduloProgresso || !moduloProgresso.concluido) {
                return modulo;
            }
        }
        // Se todos estão concluídos, retorna o último
        return this.curso.modulos[this.curso.modulos.length - 1] || null;
    }
    toggleModulo(moduloId) {
        this.moduloExpandido = this.moduloExpandido === moduloId ? null : moduloId;
    }
    toggleAvaliacoes() {
        this.mostrarAvaliacoes = !this.mostrarAvaliacoes;
    }
    toggleFormularioAvaliacao() {
        if (!this.usuarioAtual) {
            this.router.navigate(['/login']);
            return;
        }
        this.mostrarFormularioAvaliacao = !this.mostrarFormularioAvaliacao;
    }
    enviarAvaliacao() {
        if (!this.usuarioAtual || !this.curso)
            return;
        const avaliacao = {
            cursoId: this.curso.id,
            usuarioId: this.usuarioAtual.id,
            nota: this.novaAvaliacao.nota,
            comentario: this.novaAvaliacao.comentario.trim(),
            recomenda: this.novaAvaliacao.recomenda,
            dataAvaliacao: new Date()
        };
        const sub = this.cursoServico.adicionarAvaliacao(avaliacao).subscribe({
            next: () => {
                this.mostrarFormularioAvaliacao = false;
                this.novaAvaliacao = {
                    nota: 5,
                    comentario: '',
                    recomenda: true
                };
                this.carregarAvaliacoes();
                alert('Avaliação enviada com sucesso!');
            },
            error: (erro) => {
                console.error('Erro ao enviar avaliação:', erro);
                alert('Erro ao enviar avaliação. Tente novamente.');
            }
        });
        this.subscriptions.push(sub);
    }
    // Métodos utilitários
    obterIconeCategoria(categoria) {
        const icones = {
            'logica-programacao': '🧠',
            'web-basico': '🌐',
            'angular': '🅰️',
            'git': '📚',
            'scrum': '⚡',
            'lgpd': '🔒'
        };
        return icones[categoria] || '📖';
    }
    obterCorCategoria(categoria) {
        const cores = {
            'logica-programacao': '#8b5cf6',
            'web-basico': '#06b6d4',
            'angular': '#ef4444',
            'git': '#f59e0b',
            'scrum': '#10b981',
            'lgpd': '#6366f1'
        };
        return cores[categoria] || '#6b7280';
    }
    formatarDuracao(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas === 0) {
            return `${mins}min`;
        }
        else if (mins === 0) {
            return `${horas}h`;
        }
        else {
            return `${horas}h ${mins}min`;
        }
    }
    formatarPreco(preco) {
        if (preco === 0) {
            return 'Gratuito';
        }
        return `R$ ${preco.toFixed(2).replace('.', ',')}`;
    }
    gerarEstrelas(nota) {
        return Array(5).fill(false).map((_, index) => index < nota);
    }
    calcularPorcentagemEstrela(estrela) {
        if (this.estatisticasAvaliacoes.total === 0)
            return 0;
        return (this.estatisticasAvaliacoes.distribuicao[estrela - 1] / this.estatisticasAvaliacoes.total) * 100;
    }
    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    calcularProgressoPercentual() {
        if (!this.progressoCurso || !this.curso?.modulos)
            return 0;
        const totalModulos = this.curso.modulos.length;
        const modulosCompletados = this.progressoCurso.modulosCompletados?.filter((m) => m.concluido).length || 0;
        return Math.round((modulosCompletados / totalModulos) * 100);
    }
    obterStatusModulo(moduloId) {
        if (!this.progressoCurso?.modulosCompletados)
            return 'nao-iniciado';
        const moduloProgresso = this.progressoCurso.modulosCompletados.find((m) => m.moduloId === moduloId);
        if (!moduloProgresso)
            return 'nao-iniciado';
        if (moduloProgresso.concluido)
            return 'concluido';
        return 'em-progresso';
    }
    podeAvaliar() {
        return this.jaMatriculado && this.usuarioAtual !== null;
    }
    jaAvaliou() {
        if (!this.usuarioAtual)
            return false;
        return this.avaliacoes.some(avaliacao => avaliacao.usuarioId === this.usuarioAtual.id);
    }
    voltarParaCursos() {
        this.router.navigate(['/cursos']);
    }
};
DetalheCursoComponent = __decorate([
    Component({
        selector: 'app-detalhe-curso',
        standalone: true,
        imports: [CommonModule, RouterModule, FormsModule],
        templateUrl: './detalhe-curso.component.html',
        styleUrls: ['./detalhe-curso.component.css']
    })
], DetalheCursoComponent);
export { DetalheCursoComponent };
//# sourceMappingURL=detalhe-curso.component.js.map