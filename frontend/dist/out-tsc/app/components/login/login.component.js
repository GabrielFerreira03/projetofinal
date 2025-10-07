import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let LoginComponent = class LoginComponent {
    constructor(fb, authService, router) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.erro = '';
        this.carregando = false;
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
        this.authService.login(email, senha).subscribe(() => {
            this.carregando = false;
            this.router.navigate(['/cursos']);
        }, (error) => {
            this.carregando = false;
            this.erro = 'Erro ao fazer login. Verifique suas credenciais.';
            console.error('Erro de login:', error);
        });
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map