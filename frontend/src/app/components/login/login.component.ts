import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  erro: string = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.carregando = true;
    this.erro = '';

    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe(
      () => {
        this.carregando = false;
        this.router.navigate(['/cursos']);
      },
      (error) => {
        this.carregando = false;
        this.erro = 'Erro ao fazer login. Verifique suas credenciais.';
        console.error('Erro de login:', error);
      }
    );
  }
}