// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    // Verificar si hay usuario guardado al iniciar
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  setUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  getUsuario() {
    return this.usuarioSubject.value;
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }
}