import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let CadastroComponent = class CadastroComponent {
    constructor(formBuilder, authService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.loading = false;
        this.error = '';
        this.success = '';
    }
    ngOnInit() {
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
    mustMatch(controlName, matchingControlName) {
        return (formGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            }
            else {
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
};
CadastroComponent = __decorate([
    Component({
        selector: 'app-cadastro',
        templateUrl: './cadastro.component.html'
    })
], CadastroComponent);
export { CadastroComponent };
//# sourceMappingURL=cadastro.component.js.map