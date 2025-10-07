import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent implements OnInit {
  cadastroForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      tipo: ['estudante', [Validators.required]]
    }, {
      validator: this.mustMatch('senha', 'confirmarSenha')
    });
  }

  // Validador personalizado para verificar se as senhas coincidem
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Getter para facilitar o acesso aos campos do formulário
  get f() { return this.cadastroForm.controls; }

  onSubmit() {
    if (this.cadastroForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const { nome, email, senha, tipo } = this.cadastroForm.value;

    this.authService.register(email, senha, nome, tipo)
      .then(() => {
        this.success = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/cursos']);
        }, 2000);
      })
      .catch(error => {
        this.error = error.message || 'Ocorreu um erro durante o cadastro. Tente novamente.';
        this.loading = false;
      });
  }
}