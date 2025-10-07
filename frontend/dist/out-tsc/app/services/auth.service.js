import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import firebase from 'firebase/app';
import 'firebase/auth';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.apiUrl = environment.apiUrl;
        this.usuarioSubject = new BehaviorSubject(null);
        this.usuarioAtual = this.usuarioSubject.asObservable();
        this.inicializarFirebase();
        this.verificarUsuarioLogado();
    }
    inicializarFirebase() {
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
    verificarUsuarioLogado() {
        const token = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');
        if (token && usuario) {
            this.usuarioSubject.next(JSON.parse(usuario));
        }
    }
    login(email, senha) {
        return from(firebase.auth().signInWithEmailAndPassword(email, senha))
            .pipe(switchMap(resultado => {
            return from(resultado.user.getIdToken());
        }), switchMap(idToken => {
            return this.http.post(`${this.apiUrl}/auth/login`, { idToken });
        }), tap(resposta => {
            localStorage.setItem('token', resposta.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
            this.usuarioSubject.next(resposta.usuario);
        }));
    }
    cadastrar(nome, email, senha, perfil) {
        return from(firebase.auth().createUserWithEmailAndPassword(email, senha))
            .pipe(switchMap(resultado => {
            const usuarioId = resultado.user.uid;
            return this.http.post(`${this.apiUrl}/usuarios`, {
                id: usuarioId,
                nome,
                email,
                perfil,
                consentimentoLGPD: true,
                dataConsentimento: new Date().toISOString()
            });
        }));
    }
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.usuarioSubject.next(null);
        return from(firebase.auth().signOut())
            .pipe(switchMap(() => {
            return this.http.post(`${this.apiUrl}/auth/logout`, {});
        }));
    }
    getToken() {
        return localStorage.getItem('token');
    }
    isAutenticado() {
        return !!this.getToken();
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map