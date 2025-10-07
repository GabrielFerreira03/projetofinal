import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

// Componentes antigos
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { ListagemCursosComponent } from './components/listagem-cursos/listagem-cursos.component';
import { DetalheCursoComponent } from './components/detalhe-curso/detalhe-curso.component';
import { DashboardProfessorComponent } from './components/dashboard-professor/dashboard-professor.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { PerfilComponent } from './components/perfil/perfil.component';

// Novos componentes com nomes em português
import { PaginaLoginComponent } from './componentes/pagina-login/pagina-login.component';
import { PaginaInicialComponent } from './componentes/pagina-inicial/pagina-inicial.component';
import { BarraNavegacaoComponent } from './componentes/barra-navegacao/barra-navegacao.component';
import { ListaCursosComponent } from './componentes/lista-cursos/lista-cursos.component';
import { DetalheCursoComponent as DetalheCursoNovoComponent } from './componentes/detalhe-curso/detalhe-curso.component';
import { ComponenteQuizComponent } from './componentes/componente-quiz/componente-quiz.component';

// Serviços e guardas
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthGuard } from './services/auth.guard';
import { 
  GuardaAutenticacao, 
  GuardaEstudante, 
  GuardaProfessor, 
  GuardaAdministrador,
  GuardaPublico 
} from './guardas/guarda-autenticacao';

export const routes: Routes = [
  // Rota principal - página inicial
  { path: '', component: PaginaInicialComponent, canActivate: [GuardaPublico] },
  
  // Autenticação
  { path: 'login', component: PaginaLoginComponent, canActivate: [GuardaPublico] },
  { path: 'entrar', component: PaginaLoginComponent, canActivate: [GuardaPublico] },
  
  // Cursos - área pública e privada
  { path: 'cursos', component: ListaCursosComponent },
  { path: 'curso/:id', component: DetalheCursoNovoComponent },
  { path: 'curso/:id/quiz/:quizId', component: ComponenteQuizComponent, canActivate: [GuardaEstudante] },
  
  // Área do estudante
  { 
    path: 'estudante', 
    canActivate: [GuardaEstudante],
    children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      { path: 'cursos', component: ListaCursosComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },
  
  // Área do professor
  { 
    path: 'professor', 
    canActivate: [GuardaProfessor],
    children: [
      { path: '', redirectTo: 'painel', pathMatch: 'full' },
      { path: 'painel', component: DashboardProfessorComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },
  
  // Área do administrador
  { 
    path: 'admin', 
    canActivate: [GuardaAdministrador],
    children: [
      { path: '', redirectTo: 'painel', pathMatch: 'full' },
      { path: 'painel', component: DashboardProfessorComponent }, // Temporário
      { path: 'perfil', component: PerfilComponent }
    ]
  },
  
  // Rotas antigas para compatibilidade
  { path: 'cadastro', component: CadastroComponent, canActivate: [GuardaPublico] },
  { path: 'quiz/:cursoId/:quizId', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  
  // Redirecionamentos e rota padrão
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Componentes antigos
    LoginComponent,
    CadastroComponent,
    ListagemCursosComponent,
    DetalheCursoComponent,
    DashboardProfessorComponent,
    QuizComponent,
    PerfilComponent,
    
    // Novos componentes (apenas os que não são standalone)
    PaginaLoginComponent,
    BarraNavegacaoComponent,
    ListaCursosComponent
    // Componentes standalone não precisam ser declarados:
    // AppComponent, PaginaInicialComponent, DetalheCursoNovoComponent, ComponenteQuizComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    GuardaAutenticacao,
    GuardaEstudante,
    GuardaProfessor,
    GuardaAdministrador,
    GuardaPublico
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }