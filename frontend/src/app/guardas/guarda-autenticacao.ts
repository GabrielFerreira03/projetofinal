import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AutenticacaoServico } from '../servicos/autenticacao.servico';
import { TipoUsuario } from '../modelos/usuario.modelo';

@Injectable({
  providedIn: 'root'
})
export class GuardaAutenticacao implements CanActivate, CanActivateChild {

  constructor(
    private autenticacaoServico: AutenticacaoServico,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.verificarAutenticacao(route, state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  private verificarAutenticacao(route: ActivatedRouteSnapshot, url: string): Observable<boolean> {
    return this.autenticacaoServico.usuarioLogado$.pipe(
      take(1),
      map(usuario => {
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
        const permissoesRequeridas = route.data?.['permissoes'] as string[];
        if (permissoesRequeridas && permissoesRequeridas.length > 0) {
          const temPermissao = permissoesRequeridas.some(permissao => 
            this.autenticacaoServico.verificarPermissao(permissao)
          );
          
          if (!temPermissao) {
            this.redirecionarParaAcessoNegado();
            return false;
          }
        }

        // Verificar tipo de usuário específico da rota
        const tipoUsuarioRequerido = route.data?.['tipoUsuario'] as TipoUsuario;
        if (tipoUsuarioRequerido && usuario.tipoUsuario !== tipoUsuarioRequerido) {
          this.redirecionarParaTipoUsuarioIncorreto(usuario.tipoUsuario);
          return false;
        }

        // Verificar se o usuário tem acesso a múltiplos tipos
        const tiposPermitidos = route.data?.['tiposPermitidos'] as TipoUsuario[];
        if (tiposPermitidos && tiposPermitidos.length > 0) {
          if (!tiposPermitidos.includes(usuario.tipoUsuario)) {
            this.redirecionarParaTipoUsuarioIncorreto(usuario.tipoUsuario);
            return false;
          }
        }

        // Verificar se o perfil está completo (se requerido)
        const perfilCompletoRequerido = route.data?.['perfilCompleto'] as boolean;
        if (perfilCompletoRequerido && !this.verificarPerfilCompleto(usuario)) {
          this.redirecionarParaCompletarPerfil();
          return false;
        }

        return true;
      })
    );
  }

  private redirecionarParaLogin(urlRetorno: string): void {
    // Salvar URL de retorno para redirecionar após login
    sessionStorage.setItem('urlRetorno', urlRetorno);
    this.router.navigate(['/login']);
  }

  private redirecionarParaAcessoNegado(): void {
    this.router.navigate(['/acesso-negado']);
  }

  private redirecionarParaTipoUsuarioIncorreto(tipoUsuario: TipoUsuario): void {
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

  private redirecionarParaCompletarPerfil(): void {
    this.router.navigate(['/perfil/completar']);
  }

  private verificarPerfilCompleto(usuario: any): boolean {
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

  private obterValorCampo(objeto: any, caminho: string): any {
    return caminho.split('.').reduce((atual, propriedade) => {
      return atual && atual[propriedade] !== undefined ? atual[propriedade] : null;
    }, objeto);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuardaEstudante implements CanActivate {
  constructor(private guardaAutenticacao: GuardaAutenticacao) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Adicionar verificação específica para estudante
    route.data = { ...route.data, tipoUsuario: 'estudante' };
    return this.guardaAutenticacao.canActivate(route, state);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuardaProfessor implements CanActivate {
  constructor(private guardaAutenticacao: GuardaAutenticacao) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Adicionar verificação específica para professor
    route.data = { ...route.data, tipoUsuario: 'professor' };
    return this.guardaAutenticacao.canActivate(route, state);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuardaAdministrador implements CanActivate {
  constructor(private guardaAutenticacao: GuardaAutenticacao) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Adicionar verificação específica para administrador
    route.data = { ...route.data, tipoUsuario: 'administrador' };
    return this.guardaAutenticacao.canActivate(route, state);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuardaPublico implements CanActivate {
  constructor(
    private autenticacaoServico: AutenticacaoServico,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.autenticacaoServico.usuarioLogado$.pipe(
      take(1),
      map(usuario => {
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
      })
    );
  }
}

// Função auxiliar para verificar permissões em templates
export function verificarPermissaoTemplate(permissao: string): boolean {
  // Esta função pode ser usada em templates Angular
  // Implementação seria feita através de um pipe ou diretiva
  return true; // Placeholder
}

// Função auxiliar para verificar tipo de usuário em templates
export function verificarTipoUsuarioTemplate(tipo: TipoUsuario): boolean {
  // Esta função pode ser usada em templates Angular
  // Implementação seria feita através de um pipe ou diretiva
  return true; // Placeholder
}