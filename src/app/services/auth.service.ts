// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/auth'
    : 'https://jc-backend-mu05.onrender.com/api/auth';

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

  // Registro normal
  registro(usuario: any) {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  // Login normal
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // ✅ Verificar email con token (GET)
  verificarEmail(token: string) {
    return this.http.get(`${this.apiUrl}/verificar-email?token=${token}`);
  }

  // ✅ Reenviar correo de verificación (POST)
  reenviarVerificacion(email: string) {
    return this.http.post(`${this.apiUrl}/reenviar-verificacion`, { email });
  }

  // Obtener usuario por email
  getUsuarioByEmail(email: string) {
    return this.http.get(`${this.apiUrl}/me?email=${email}`);
  }

  setUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  get usuario() {
    return this.usuarioSubject.value;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.usuarioSubject.value !== null;
  }
}