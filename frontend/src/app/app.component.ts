import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificacoesComponent } from './componentes/notificacoes/notificacoes.component';
import { BarraNavegacaoComponent } from './componentes/barra-navegacao/barra-navegacao.component';

@Component({
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
export class AppComponent implements OnInit {
  titulo = 'EduNext';
  usuarioLogado = false;
  perfilUsuario: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
}