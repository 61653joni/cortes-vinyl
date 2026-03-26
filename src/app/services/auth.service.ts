// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  // Registro
  registro(usuario: any) {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  // Login
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Verificar email
  verificarEmail(token: string) {
    return this.http.get(`${this.apiUrl}/verificar-email?token=${token}`);
  }

  // Reenviar verificación
  reenviarVerificacion(email: string) {
    return this.http.post(`${this.apiUrl}/reenviar-verificacion`, { email });
  }

  // Obtener usuario
  getUsuarioByEmail(email: string) {
    return this.http.get(`${this.apiUrl}/me?email=${email}`);
  }

  // Guardar usuario
  setUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  // Logout
  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Getter usuario actual
  get usuario() {
    return this.usuarioSubject.value;
  }

  // Estado autenticación
  isAuthenticated(): boolean {
    return this.usuarioSubject.value !== null;
  }
}