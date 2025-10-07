import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
let GuardaAutenticacao = class GuardaAutenticacao {
    constructor(autenticacaoServico, router) {
        this.autenticacaoServico = autenticacaoServico;
        this.router = router;
    }
    canActivate(route, state) {
        return this.verificarAutenticacao(route, state.url);
    }
    canActivateChild(childRoute, state) {
        return this.canActivate(childRoute, state);
    }
    verificarAutenticacao(route, url) {
        return this.autenticacaoServico.usuarioLogado$.pipe(take(1), map(usuario => {
            // Verificar se o usuário está logado
            if (!usuario) {
                this.redirecionarParaLogin(url);
                return false;
            }
            // Verificar se o token ainda é válido
            if (!this.autenticacaoServico.verificarTokenValido()) {
                this.autenticacaoServico.logout();
                this.redirecionarParaLogin(url);
                return false;
            }
            // Verificar permissões específicas da rota
            const permissoesRequeridas = route.data?.['permissoes'];
            if (permissoesRequeridas && permissoesRequeridas.length > 0) {
                const temPermissao = permissoesRequeridas.some(permissao => this.autenticacaoServico.verificarPermissao(permissao));
                if (!temPermissao) {
                    this.redirecionarParaAcessoNegado();
                    return false;
                }
            }
            // Verificar tipo de usuário específico da rota
            const tipoUsuarioRequerido = route.data?.['tipoUsuario'];
            if (tipoUsuarioRequerido && usuario.tipoUsuario !== tipoUsuarioRequerido) {
                this.redirecionarParaTipoUsuarioIncorreto(usuario.tipoUsuario);
                return false;
            }
            // Verificar se o usuário tem acesso a múltiplos tipos
            const tiposPermitidos = route.data?.['tiposPermitidos'];
            if (tiposPermitidos && tiposPermitidos.length > 0) {
                if (!tiposPermitidos.includes(usuario.tipoUsuario)) {
                    this.redirecionarParaTipoUsuarioIncorreto(usuario.tipoUsuario);
                    return false;
                }
            }
            // Verificar se o perfil está completo (se requerido)
            const perfilCompletoRequerido = route.data?.['perfilCompleto'];
            if (perfilCompletoRequerido && !this.verificarPerfilCompleto(usuario)) {
                this.redirecionarParaCompletarPerfil();
                return false;
            }
            return true;
        }));
    }
    redirecionarParaLogin(urlRetorno) {
        // Salvar URL de retorno para redirecionar após login
        sessionStorage.setItem('urlRetorno', urlRetorno);
        this.router.navigate(['/login']);
    }
    redirecionarParaAcessoNegado() {
        this.router.navigate(['/acesso-negado']);
    }
    redirecionarParaTipoUsuarioIncorreto(tipoUsuario) {
        // Redirecionar para a página inicial apropriada para o tipo de usuário
        switch (tipoUsuario) {
            case 'estudante':
                this.router.navigate(['/estudante/dashboard']);
                break;
            case 'professor':
                this.router.navigate(['/professor/painel']);
                break;
            case 'administrador':
                this.router.navigate(['/admin/dashboard']);
                break;
            default:
                this.router.navigate(['/']);
                break;
        }
    }
    redirecionarParaCompletarPerfil() {
        this.router.navigate(['/perfil/completar']);
    }
    verificarPerfilCompleto(usuario) {
        // Verificar se os campos obrigatórios do perfil estão preenchidos
        const camposObrigatorios = [
            'nome',
            'email',
            'perfil.telefone',
            'perfil.endereco.cidade',
            'perfil.endereco.estado'
        ];
        return camposObrigatorios.every(campo => {
            const valor = this.obterValorCampo(usuario, campo);
            return valor !== null && valor !== undefined && valor !== '';
        });
    }
    obterValorCampo(objeto, caminho) {
        return caminho.split('.').reduce((atual, propriedade) => {
            return atual && atual[propriedade] !== undefined ? atual[propriedade] : null;
        }, objeto);
    }
};
GuardaAutenticacao = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GuardaAutenticacao);
export { GuardaAutenticacao };
let GuardaEstudante = class GuardaEstudante {
    constructor(guardaAutenticacao) {
        this.guardaAutenticacao = guardaAutenticacao;
    }
    canActivate(route, state) {
        // Adicionar verificação específica para estudante
        route.data = { ...route.data, tipoUsuario: 'estudante' };
        return this.guardaAutenticacao.canActivate(route, state);
    }
};
GuardaEstudante = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GuardaEstudante);
export { GuardaEstudante };
let GuardaProfessor = class GuardaProfessor {
    constructor(guardaAutenticacao) {
        this.guardaAutenticacao = guardaAutenticacao;
    }
    canActivate(route, state) {
        // Adicionar verificação específica para professor
        route.data = { ...route.data, tipoUsuario: 'professor' };
        return this.guardaAutenticacao.canActivate(route, state);
    }
};
GuardaProfessor = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GuardaProfessor);
export { GuardaProfessor };
let GuardaAdministrador = class GuardaAdministrador {
    constructor(guardaAutenticacao) {
        this.guardaAutenticacao = guardaAutenticacao;
    }
    canActivate(route, state) {
        // Adicionar verificação específica para administrador
        route.data = { ...route.data, tipoUsuario: 'administrador' };
        return this.guardaAutenticacao.canActivate(route, state);
    }
};
GuardaAdministrador = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GuardaAdministrador);
export { GuardaAdministrador };
let GuardaPublico = class GuardaPublico {
    constructor(autenticacaoServico, router) {
        this.autenticacaoServico = autenticacaoServico;
        this.router = router;
    }
    canActivate(route, state) {
        return this.autenticacaoServico.usuarioLogado$.pipe(take(1), map(usuario => {
            // Se o usuário já está logado, redirecionar para dashboard
            if (usuario) {
                switch (usuario.tipoUsuario) {
                    case 'estudante':
                        this.router.navigate(['/estudante/dashboard']);
                        break;
                    case 'professor':
                        this.router.navigate(['/professor/painel']);
                        break;
                    case 'administrador':
                        this.router.navigate(['/admin/dashboard']);
                        break;
                    default:
                        this.router.navigate(['/']);
                        break;
                }
                return false;
            }
            return true;
        }));
    }
};
GuardaPublico = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GuardaPublico);
export { GuardaPublico };
// Função auxiliar para verificar permissões em templates
export function verificarPermissaoTemplate(permissao) {
    // Esta função pode ser usada em templates Angular
    // Implementação seria feita através de um pipe ou diretiva
    return true; // Placeholder
}
// Função auxiliar para verificar tipo de usuário em templates
export function verificarTipoUsuarioTemplate(tipo) {
    // Esta função pode ser usada em templates Angular
    // Implementação seria feita através de um pipe ou diretiva
    return true; // Placeholder
}
//# sourceMappingURL=guarda-autenticacao.js.map