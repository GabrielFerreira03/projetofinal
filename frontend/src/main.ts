import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.module';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { 
  GuardaAutenticacao, 
  GuardaEstudante, 
  GuardaProfessor, 
  GuardaAdministrador,
  GuardaPublico 
} from './app/guardas/guarda-autenticacao';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule.forRoot(routes)
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    GuardaAutenticacao,
    GuardaEstudante,
    GuardaProfessor,
    GuardaAdministrador,
    GuardaPublico
  ]
}).catch(err => console.error(err));