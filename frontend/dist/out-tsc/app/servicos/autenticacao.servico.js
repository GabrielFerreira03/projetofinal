import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let AutenticacaoServico = class AutenticacaoServico {
    constructor() {
        this.API_URL = 'http://localhost:3000/api';
        this.usuarioAtualSubject = new BehaviorSubject(null);
        this.tokenSubject = new BehaviorSubject(null);
        this.usuarioAtual$ = this.usuarioAtualSubject.asObservable();
        this.token$ = this.tokenSubject.asObservable();
        this.carregarDadosArmazenados();
    }
    carregarDadosArmazenados() {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const usuarioData = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
        if (token && usuarioData) {
            try {
                const usuario = JSON.parse(usuarioData);
                this.tokenSubject.next(token);
                this.usuarioAtualSubject.next(usuario);
            }
            catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                this.limparDadosArmazenados();
            }
        }
    }
    salvarDadosArmazenados(usuario, token, lembrarMe = false) {
        const storage = lembrarMe ? localStorage : sessionStorage;
        storage.setItem('token', token);
        storage.setItem('usuario', JSON.stringify(usuario));
        this.tokenSubject.next(token);
        this.usuarioAtualSubject.next(usuario);
    }
    limparDadosArmazenados() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        this.tokenSubject.next(null);
        this.usuarioAtualSubject.next(null);
    }
    async login(email, senha, lembrarMe = false) {
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
            }
            else {
                return {
                    sucesso: false,
                    mensagem: data.mensagem || 'Credenciais inválidas'
                };
            }
        }
        catch (error) {
            console.error('Erro no login:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async cadastrar(dados) {
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
            }
            else {
                return {
                    sucesso: false,
                    mensagem: data.mensagem || 'Erro ao criar conta'
                };
            }
        }
        catch (error) {
            console.error('Erro no cadastro:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async recuperarSenha(email) {
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
        }
        catch (error) {
            console.error('Erro na recuperação de senha:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async alterarSenha(senhaAtual, novaSenha) {
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
        }
        catch (error) {
            console.error('Erro ao alterar senha:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async atualizarPerfil(dadosAtualizacao) {
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
            }
            else {
                return {
                    sucesso: false,
                    mensagem: data.mensagem || 'Erro ao atualizar perfil'
                };
            }
        }
        catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return {
                sucesso: false,
                mensagem: 'Erro de conexão. Tente novamente.'
            };
        }
    }
    async verificarToken() {
        try {
            const token = this.obterToken();
            if (!token)
                return false;
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
        }
        catch (error) {
            console.error('Erro ao verificar token:', error);
            this.logout();
            return false;
        }
    }
    logout() {
        this.limparDadosArmazenados();
    }
    estaLogado() {
        return this.tokenSubject.value !== null && this.usuarioAtualSubject.value !== null;
    }
    obterUsuarioAtual() {
        return this.usuarioAtualSubject.value;
    }
    obterToken() {
        return this.tokenSubject.value;
    }
    temPermissao(permissao) {
        const usuario = this.obterUsuarioAtual();
        if (!usuario)
            return false;
        // Administradores têm todas as permissões
        if (usuario.tipo === 'administrador')
            return true;
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
    ehProfessor() {
        const usuario = this.obterUsuarioAtual();
        return usuario?.tipo === 'professor';
    }
    ehEstudante() {
        const usuario = this.obterUsuarioAtual();
        return usuario?.tipo === 'estudante';
    }
    ehAdministrador() {
        const usuario = this.obterUsuarioAtual();
        return usuario?.tipo === 'administrador';
    }
    // Método para obter headers com autenticação
    obterHeadersAutenticados() {
        const token = this.obterToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }
};
AutenticacaoServico = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AutenticacaoServico);
export { AutenticacaoServico };
//# sourceMappingURL=autenticacao.servico.js.map