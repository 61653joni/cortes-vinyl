import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface User {
  email: string;
  nombre: string;
  role: string;
  estado: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {

  user: User = {
    email: '',
    nombre: '',
    role: '',
    estado: 'activo'
  };
  
  displayEditModal: boolean = false;
  userBackup: User = { ...this.user };
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    try {
      const usuarioAuth = this.authService.usuario;
      console.log('Usuario de AuthService:', usuarioAuth);
      
      if (usuarioAuth && usuarioAuth.email) {
        this.user = {
          email: usuarioAuth.email || '',
          nombre: usuarioAuth.nombre || usuarioAuth.email?.split('@')[0] || 'Usuario',
          role: this.getRoleName(usuarioAuth.tipo_usu || usuarioAuth.role || 'miembro'),
          estado: usuarioAuth.estado || 'activo'
        };
        console.log('Perfil cargado:', this.user);
      } else {
        const localUser = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (localUser.email) {
          this.user = {
            email: localUser.email || '',
            nombre: localUser.nombre || localUser.email?.split('@')[0] || 'Usuario',
            role: this.getRoleName(localUser.tipo_usu || localUser.role || 'miembro'),
            estado: localUser.estado || 'activo'
          };
        } else {
          this.mensajeError = 'No hay usuario logueado';
        }
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      this.mensajeError = 'Error al cargar los datos';
    } finally {
      this.cargando = false;
    }
  }

  getRoleName(role: string): string {
    const roles: { [key: string]: string } = {
      'super': 'Super Administrador',
      'admin': 'Administrador',
      'miembro': 'Miembro'
    };
    return roles[role] || role || 'Miembro';
  }

  getEstadoClass(): string {
    return this.user.estado === 'activo' ? 'estado-activo' : 'estado-inactivo';
  }

  getInitials(): string {
    return this.user.nombre ? this.user.nombre.charAt(0).toUpperCase() : 'U';
  }

  abrirEditarPerfil() {
    this.userBackup = { ...this.user };
    this.displayEditModal = true;
  }

  guardarCambios() {
    if (!this.user.nombre || this.user.nombre.trim() === '') {
      this.mensajeError = 'El nombre es obligatorio';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }

    try {
      const usuarioActual = this.authService.usuario;
      
      if (usuarioActual && usuarioActual.email) {
        const usuarioActualizado = {
          ...usuarioActual,
          nombre: this.user.nombre
        };
        
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        this.authService.setUsuario(usuarioActualizado);
        
        this.mensajeExito = 'Perfil actualizado correctamente';
        setTimeout(() => this.mensajeExito = '', 3000);
      } else {
        this.mensajeError = 'No se pudo actualizar el perfil';
      }
      
      this.displayEditModal = false;
    } catch (error) {
      console.error('Error al guardar:', error);
      this.mensajeError = 'Error al actualizar el perfil';
      setTimeout(() => this.mensajeError = '', 3000);
    }
  }

  cerrarModal() {
    this.user = { ...this.userBackup };
    this.displayEditModal = false;
  }
}