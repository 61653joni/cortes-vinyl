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
  errorMessage = '';
  successMessage = '';

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

    if (!this.nombre || !this.apellido) {
      this.errorMessage = 'Nombre y apellido son obligatorios';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {
      const usuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        curp: this.curp,
        telefono: this.telefono,
        email: this.email,
        password: this.password
      };

      const response: any = await this.authService.registro(usuario).toPromise();
      
     
      
      // Limpiar formulario
      this.nombre = '';
      this.apellido = '';
      this.curp = '';
      this.telefono = '';
      this.email = '';
      this.password = '';
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      
    } catch (error: any) {
      this.errorMessage = error.error?.error || 'Error al registrar usuario';
    }
  }
}