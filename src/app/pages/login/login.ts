// login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showResendButton: boolean = false; 

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    this.showResendButton = false;

    this.authService.login(this.email, this.password).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        
        // ✅ Verificar si el email está confirmado
        if (data.email_verified === false) {
          this.errorMessage = '⚠️ Por favor, confirma tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada (incluyendo spam) y haz clic en el enlace de verificación.';
          this.showResendButton = true; // Mostrar botón para reenviar correo
          return;
        }
        
        this.errorMessage = '';
        this.authService.setUsuario(data);
        
        if (data.tipo_usu === 'admin') {
          this.router.navigate(['/Dashboard']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // ✅ Mensajes de error más específicos
        if (error.status === 403 && error.error?.message?.includes('verificar')) {
          this.errorMessage = '⚠️ Tu cuenta no está verificada. Revisa tu correo para confirmar tu cuenta.';
          this.showResendButton = true;
        } else if (error.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else {
          this.errorMessage = 'Error de conexión. Intenta nuevamente.';
        }
      }
    });
  }

  // ✅ Método para reenviar correo de verificación
  async reenviarVerificacion() {
    if (!this.email) {
      this.errorMessage = 'Ingresa tu correo primero';
      return;
    }
    
    this.isLoading = true;
    try {
      await this.authService.reenviarVerificacion(this.email);
      this.errorMessage = '';
      this.showResendButton = false;
      alert('📧 Correo de verificación reenviado. Por favor revisa tu bandeja de entrada.');
    } catch (error) {
      this.errorMessage = 'Error al reenviar el correo. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
}