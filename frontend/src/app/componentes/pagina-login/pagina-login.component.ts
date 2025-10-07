import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutenticacaoServico } from '../../servicos/autenticacao.servico';
import { Usuario } from '../../modelos/usuario.modelo';

@Component({
  selector: 'app-pagina-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagina-login.component.html',
  styleUrls: ['./pagina-login.component.css']
})
export class PaginaLoginComponent implements OnInit {
  formularioLogin: FormGroup;
  carregando = false;
  erro = '';
  sucesso = '';
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private autenticacaoServico: AutenticacaoServico,
    private router: Router
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      lembrarMe: [false]
    });
  }

  ngOnInit(): void {
    // Verificar se já está logado
    if (this.autenticacaoServico.estaLogado()) {
      this.redirecionarPorTipoUsuario();
    }
  }

  async onSubmit(): Promise<void> {
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
        } else {
          this.erro = resultado.mensagem || 'Erro ao fazer login. Verifique suas credenciais.';
        }
      } catch (error: any) {
        console.error('Erro no login:', error);
        this.erro = 'Erro interno. Tente novamente mais tarde.';
      } finally {
        this.carregando = false;
      }
    } else {
      this.marcarCamposComoTocados();
    }
  }

  private redirecionarPorTipoUsuario(): void {
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
    } else {
      this.router.navigate(['/']);
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formularioLogin.controls).forEach(campo => {
      this.formularioLogin.get(campo)?.markAsTouched();
    });
  }

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  navegarParaRecuperarSenha(): void {
    this.router.navigate(['/recuperar-senha']);
  }

  // Métodos auxiliares para validação
  get email() {
    return this.formularioLogin.get('email');
  }

  get senha() {
    return this.formularioLogin.get('senha');
  }

  get emailInvalido(): boolean {
    return !!(this.email?.invalid && this.email?.touched);
  }

  get senhaInvalida(): boolean {
    return !!(this.senha?.invalid && this.senha?.touched);
  }

  obterErroEmail(): string {
    if (this.email?.errors?.['required']) {
      return 'Email é obrigatório';
    }
    if (this.email?.errors?.['email']) {
      return 'Email inválido';
    }
    return '';
  }

  obterErroSenha(): string {
    if (this.senha?.errors?.['required']) {
      return 'Senha é obrigatória';
    }
    if (this.senha?.errors?.['minlength']) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    return '';
  }
}