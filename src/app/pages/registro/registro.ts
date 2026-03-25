// registro.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  nombre = '';
  apellido = '';
  curp = '';
  telefono = '';
  email = '';
  password = '';
  confirmPassword = ''; // ✅ Agregar campo para confirmar contraseña
  errorMessage = '';
  successMessage = '';
  isLoading = false; // ✅ Para mostrar estado de carga

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async registrar() {
    // Validaciones
    if (!this.email || !this.password) {
      this.errorMessage = 'Correo y contraseña son obligatorios';
      return;
    }

    // ✅ Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.nombre || !this.apellido) {
      this.errorMessage = 'Nombre y apellido son obligatorios';
      return;
    }

    // ✅ Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Ingresa un correo electrónico válido';
      return;
    }

    // ✅ Validar longitud de contraseña
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    try {
      const usuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        curp: this.curp,
        telefono: this.telefono,
        email: this.email,
        password: this.password
      };

      // ✅ Usar el nuevo método con verificación
      const response: any = await this.authService.registro(usuario).toPromise();
      
      // ✅ Mostrar mensaje de éxito con instrucciones
      this.successMessage = '¡Registro exitoso! Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para confirmar tu cuenta.';
      
      // ✅ Limpiar formulario
      this.nombre = '';
      this.apellido = '';
      this.curp = '';
      this.telefono = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      
      // ✅ Redirigir al login después de 5 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 5000);
      
    } catch (error: any) {
      this.isLoading = false;
      // ✅ Mejorar mensajes de error
      if (error.error?.error?.includes('duplicate') || error.error?.error?.includes('already registered')) {
        this.errorMessage = 'Este correo electrónico ya está registrado. Por favor, inicia sesión o recupera tu contraseña.';
      } else {
        this.errorMessage = error.error?.error || 'Error al registrar usuario. Intenta nuevamente.';
      }
    }
  }

  // ✅ Método para reenviar correo de verificación
  async reenviarVerificacion() {
    if (!this.email) {
      this.errorMessage = 'Ingresa tu correo para reenviar la verificación';
      return;
    }
    
    this.isLoading = true;
    try {
      await this.authService.reenviarVerificacion(this.email);
      this.successMessage = 'Correo de verificación reenviado. Revisa tu bandeja de entrada.';
    } catch (error) {
      this.errorMessage = 'Error al reenviar el correo. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
}