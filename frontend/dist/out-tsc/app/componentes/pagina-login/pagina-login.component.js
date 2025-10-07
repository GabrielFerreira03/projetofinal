import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
let PaginaLoginComponent = class PaginaLoginComponent {
    constructor(fb, autenticacaoServico, router) {
        this.fb = fb;
        this.autenticacaoServico = autenticacaoServico;
        this.router = router;
        this.carregando = false;
        this.erro = '';
        this.sucesso = '';
        this.mostrarSenha = false;
        this.formularioLogin = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
            lembrarMe: [false]
        });
    }
    ngOnInit() {
        // Verificar se já está logado
        if (this.autenticacaoServico.estaLogado()) {
            this.redirecionarPorTipoUsuario();
        }
    }
    async onSubmit() {
        if (this.formularioLogin.valid) {
            this.carregando = true;
            this.erro = '';
            this.sucesso = '';
            try {
                const { email, senha, lembrarMe } = this.formularioLogin.value;
                const resultado = await this.autenticacaoServico.login(email, senha);
                if (resultado.sucesso) {
                    this.sucesso = 'Login realizado com sucesso!';
                    // Salvar preferência de "lembrar-me"
                    if (lembrarMe) {
                        localStorage.setItem('lembrarMe', 'true');
                    }
                    // Aguardar um pouco para mostrar a mensagem de sucesso
                    setTimeout(() => {
                        this.redirecionarPorTipoUsuario();
                    }, 1000);
                }
                else {
                    this.erro = resultado.mensagem || 'Erro ao fazer login. Verifique suas credenciais.';
                }
            }
            catch (error) {
                console.error('Erro no login:', error);
                this.erro = 'Erro interno. Tente novamente mais tarde.';
            }
            finally {
                this.carregando = false;
            }
        }
        else {
            this.marcarCamposComoTocados();
        }
    }
    redirecionarPorTipoUsuario() {
        const usuario = this.autenticacaoServico.obterUsuarioAtual();
        if (usuario) {
            switch (usuario.tipo) {
                case 'estudante':
                    this.router.navigate(['/cursos']);
                    break;
                case 'professor':
                    this.router.navigate(['/painel-professor']);
                    break;
                case 'administrador':
                    this.router.navigate(['/admin']);
                    break;
                default:
                    this.router.navigate(['/']);
            }
        }
        else {
            this.router.navigate(['/']);
        }
    }
    marcarCamposComoTocados() {
        Object.keys(this.formularioLogin.controls).forEach(campo => {
            this.formularioLogin.get(campo)?.markAsTouched();
        });
    }
    alternarVisibilidadeSenha() {
        this.mostrarSenha = !this.mostrarSenha;
    }
    navegarParaCadastro() {
        this.router.navigate(['/cadastro']);
    }
    navegarParaRecuperarSenha() {
        this.router.navigate(['/recuperar-senha']);
    }
    // Métodos auxiliares para validação
    get email() {
        return this.formularioLogin.get('email');
    }
    get senha() {
        return this.formularioLogin.get('senha');
    }
    get emailInvalido() {
        return !!(this.email?.invalid && this.email?.touched);
    }
    get senhaInvalida() {
        return !!(this.senha?.invalid && this.senha?.touched);
    }
    obterErroEmail() {
        if (this.email?.errors?.['required']) {
            return 'Email é obrigatório';
        }
        if (this.email?.errors?.['email']) {
            return 'Email inválido';
        }
        return '';
    }
    obterErroSenha() {
        if (this.senha?.errors?.['required']) {
            return 'Senha é obrigatória';
        }
        if (this.senha?.errors?.['minlength']) {
            return 'Senha deve ter pelo menos 6 caracteres';
        }
        return '';
    }
};
PaginaLoginComponent = __decorate([
    Component({
        selector: 'app-pagina-login',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule],
        templateUrl: './pagina-login.component.html',
        styleUrls: ['./pagina-login.component.css']
    })
], PaginaLoginComponent);
export { PaginaLoginComponent };
//# sourceMappingURL=pagina-login.component.js.map