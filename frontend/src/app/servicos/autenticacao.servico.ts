import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario, TipoUsuario } from '../modelos/usuario.modelo';

export interface ResultadoAutenticacao {
  sucesso: boolean;
  mensagem?: string;
  usuario?: Usuario;
  token?: string;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  tipo: TipoUsuario;
  telefone?: string;
  dataNascimento?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoServico {
  private readonly API_URL = 'http://localhost:3002/api';
  private usuarioAtualSubject = new BehaviorSubject<Usuario | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public usuarioAtual$ = this.usuarioAtualSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor() {
    this.carregarDadosArmazenados();
  }

  private carregarDadosArmazenados(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const usuarioData = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');

    if (token && usuarioData) {
      try {
        const usuario = JSON.parse(usuarioData);
        this.tokenSubject.next(token);
        this.usuarioAtualSubject.next(usuario);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.limparDadosArmazenados();
      }
    }
  }

  private salvarDadosArmazenados(usuario: Usuario, token: string, lembrarMe: boolean = false): void {
    const storage = lembrarMe ? localStorage : sessionStorage;
    
    storage.setItem('token', token);
    storage.setItem('usuario', JSON.stringify(usuario));
    
    this.tokenSubject.next(token);
    this.usuarioAtualSubject.next(usuario);
  }

  private limparDadosArmazenados(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    
    this.tokenSubject.next(null);
    this.usuarioAtualSubject.next(null);
  }

  async login(email: string, senha: string, lembrarMe: boolean = false): Promise<ResultadoAutenticacao> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        this.salvarDadosArmazenados(data.usuario, data.token, lembrarMe);
        
        return {
          sucesso: true,
          usuario: data.usuario,
          token: data.token,
          mensagem: 'Login realizado com sucesso!'
        };
      } else {
        return {
          sucesso: false,
          mensagem: data.mensagem || 'Credenciais inválidas'
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async cadastrar(dados: DadosCadastro): Promise<ResultadoAutenticacao> {
    try {
      const response = await fetch(`${this.API_URL}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        this.salvarDadosArmazenados(data.usuario, data.token);
        
        return {
          sucesso: true,
          usuario: data.usuario,
          token: data.token,
          mensagem: 'Cadastro realizado com sucesso!'
        };
      } else {
        return {
          sucesso: false,
          mensagem: data.mensagem || 'Erro ao criar conta'
        };
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async recuperarSenha(email: string): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const response = await fetch(`${this.API_URL}/auth/recuperar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        sucesso: response.ok,
        mensagem: data.mensagem || (response.ok ? 
          'Email de recuperação enviado!' : 
          'Erro ao enviar email de recuperação')
      };
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async alterarSenha(senhaAtual: string, novaSenha: string): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const token = this.obterToken();
      if (!token) {
        return {
          sucesso: false,
          mensagem: 'Usuário não autenticado'
        };
      }

      const response = await fetch(`${this.API_URL}/auth/alterar-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await response.json();

      return {
        sucesso: response.ok,
        mensagem: data.mensagem || (response.ok ? 
          'Senha alterada com sucesso!' : 
          'Erro ao alterar senha')
      };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async atualizarPerfil(dadosAtualizacao: Partial<Usuario>): Promise<{ sucesso: boolean; mensagem: string; usuario?: Usuario }> {
    try {
      const token = this.obterToken();
      if (!token) {
        return {
          sucesso: false,
          mensagem: 'Usuário não autenticado'
        };
      }

      const response = await fetch(`${this.API_URL}/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizacao),
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        // Atualizar dados locais
        const usuarioAtual = this.obterUsuarioAtual();
        if (usuarioAtual) {
          const usuarioAtualizado = { ...usuarioAtual, ...data.usuario };
          const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
          storage.setItem('usuario', JSON.stringify(usuarioAtualizado));
          this.usuarioAtualSubject.next(usuarioAtualizado);
        }

        return {
          sucesso: true,
          mensagem: 'Perfil atualizado com sucesso!',
          usuario: data.usuario
        };
      } else {
        return {
          sucesso: false,
          mensagem: data.mensagem || 'Erro ao atualizar perfil'
        };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  async verificarToken(): Promise<boolean> {
    try {
      const token = this.obterToken();
      if (!token) return false;

      const response = await fetch(`${this.API_URL}/auth/verificar`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.limparDadosArmazenados();
  }

  estaLogado(): boolean {
    return this.tokenSubject.value !== null && this.usuarioAtualSubject.value !== null;
  }

  obterUsuarioAtual(): Usuario | null {
    return this.usuarioAtualSubject.value;
  }

  obterToken(): string | null {
    return this.tokenSubject.value;
  }

  temPermissao(permissao: string): boolean {
    const usuario = this.obterUsuarioAtual();
    if (!usuario) return false;

    // Administradores têm todas as permissões
    if (usuario.tipo === 'administrador') return true;

    // Verificar permissões específicas baseadas no tipo de usuário
    switch (permissao) {
      case 'criar_curso':
      case 'editar_curso':
      case 'excluir_curso':
        return usuario.tipo === 'professor';
      
      case 'visualizar_curso':
      case 'fazer_quiz':
        return ['estudante', 'professor'].includes(usuario.tipo);
      
      case 'gerenciar_usuarios':
      case 'visualizar_relatorios':
        return usuario.tipo === 'administrador';
      
      default:
        return false;
    }
  }

  ehProfessor(): boolean {
    const usuario = this.obterUsuarioAtual();
    return usuario?.tipo === 'professor';
  }

  ehEstudante(): boolean {
    const usuario = this.obterUsuarioAtual();
    return usuario?.tipo === 'estudante';
  }

  ehAdministrador(): boolean {
    const usuario = this.obterUsuarioAtual();
    return usuario?.tipo === 'administrador';
  }

  // Método para obter headers com autenticação
  obterHeadersAutenticados(): HeadersInit {
    const token = this.obterToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
}