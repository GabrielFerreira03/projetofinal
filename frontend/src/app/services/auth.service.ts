import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import firebase from 'firebase/app';
import 'firebase/auth';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  
  usuarioAtual = this.usuarioSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.inicializarFirebase();
    this.verificarUsuarioLogado();
  }
  
  private inicializarFirebase() {
    const firebaseConfig = {
      apiKey: environment.firebase.apiKey,
      authDomain: environment.firebase.authDomain,
      projectId: environment.firebase.projectId,
      storageBucket: environment.firebase.storageBucket,
      messagingSenderId: environment.firebase.messagingSenderId,
      appId: environment.firebase.appId
    };
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
  
  private verificarUsuarioLogado() {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (token && usuario) {
      this.usuarioSubject.next(JSON.parse(usuario));
    }
  }
  
  login(email: string, senha: string): Observable<any> {
    return from(firebase.auth().signInWithEmailAndPassword(email, senha))
      .pipe(
        switchMap(resultado => {
          return from(resultado.user!.getIdToken());
        }),
        switchMap(idToken => {
          return this.http.post<any>(`${this.apiUrl}/auth/login`, { idToken });
        }),
        tap(resposta => {
          localStorage.setItem('token', resposta.token);
          localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
          this.usuarioSubject.next(resposta.usuario);
        })
      );
  }
  
  cadastrar(nome: string, email: string, senha: string, perfil: string): Observable<any> {
    return from(firebase.auth().createUserWithEmailAndPassword(email, senha))
      .pipe(
        switchMap(resultado => {
          const usuarioId = resultado.user!.uid;
          
          return this.http.post(`${this.apiUrl}/usuarios`, {
            id: usuarioId,
            nome,
            email,
            perfil,
            aceitouTermos: true,
            dataConsentimento: new Date().toISOString()
          });
        })
      );
  }
  
  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    
    return from(firebase.auth().signOut())
      .pipe(
        switchMap(() => {
          return this.http.post(`${this.apiUrl}/auth/logout`, {});
        })
      );
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isAutenticado(): boolean {
    return !!this.getToken();
  }
}