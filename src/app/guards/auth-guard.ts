import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // ✅ Usa el getter 'usuario'
    const usuario = this.authService.usuario;
    
    // Si está logueado y es admin, permite acceso
    if (usuario && usuario.tipo_usu === 'admin') {
      return true;
    }
    
    // Si no, redirige al login
    this.router.navigate(['/login']);
    return false;
  }
}