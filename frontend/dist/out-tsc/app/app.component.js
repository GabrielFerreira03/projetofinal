import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificacoesComponent } from './componentes/notificacoes/notificacoes.component';
import { BarraNavegacaoComponent } from './componentes/barra-navegacao/barra-navegacao.component';
let AppComponent = class AppComponent {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
        this.titulo = 'EduNext';
        this.usuarioLogado = false;
        this.perfilUsuario = '';
    }
    ngOnInit() {
        this.authService.usuarioAtual.subscribe(usuario => {
            this.usuarioLogado = !!usuario;
            this.perfilUsuario = usuario?.perfil || '';
        });
    }
    logout() {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [
            CommonModule,
            RouterOutlet,
            NotificacoesComponent,
            BarraNavegacaoComponent
        ],
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map