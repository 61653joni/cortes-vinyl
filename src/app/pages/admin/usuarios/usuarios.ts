// src/app/pages/admin/usuarios/usuarios.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipo_usu: 'admin' | 'estudiante' | 'bibliotecario';
  estado: 'activo' | 'bloqueado' | 'pendiente';
  email_verified: boolean;
  created_at: string;
  ultimo_acceso?: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPagina: Usuario[] = [];
  
  // Filtros
  filtroTipo = 'todos';
  filtroEstado = 'todos';
  filtroBusqueda = '';
  
  // Paginación
  paginaActual = 1;
  readonly porPagina = 10;
  
  // Modal
  mostrarModal = false;
  usuarioSeleccionado: Usuario | null = null;
  accionModal = '';
  
  // Mensajes
  mensaje = '';
  esError = false;
  cargando = false;
  
  // Estadísticas
  totalUsuarios = 0;
  totalAdmin = 0;
  totalEstudiantes = 0;
  totalBloqueados = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  get totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.porPagina) || 1;
  }

  cargarUsuarios() {
    this.cargando = true;
    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/usuarios'
      : 'https://jc-backend-mu05.onrender.com/api/usuarios';
    
    this.http.get<Usuario[]>(apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.mostrarMensaje('Error al cargar usuarios', true);
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas() {
    this.totalUsuarios = this.usuarios.length;
    this.totalAdmin = this.usuarios.filter(u => u.tipo_usu === 'admin').length;
    this.totalEstudiantes = this.usuarios.filter(u => u.tipo_usu === 'estudiante').length;
    this.totalBloqueados = this.usuarios.filter(u => u.estado === 'bloqueado').length;
  }

  aplicarFiltros() {
    let filtrados = [...this.usuarios];
    
    // Filtro por tipo de usuario
    if (this.filtroTipo !== 'todos') {
      filtrados = filtrados.filter(u => u.tipo_usu === this.filtroTipo);
    }
    
    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      filtrados = filtrados.filter(u => u.estado === this.filtroEstado);
    }
    
    // Búsqueda por nombre, email o teléfono
    if (this.filtroBusqueda) {
      const busqueda = this.filtroBusqueda.toLowerCase();
      filtrados = filtrados.filter(u => 
        u.nombre.toLowerCase().includes(busqueda) ||
        u.apellido?.toLowerCase().includes(busqueda) ||
        u.email.toLowerCase().includes(busqueda) ||
        u.telefono?.includes(busqueda)
      );
    }
    
    this.usuariosFiltrados = filtrados;
    this.paginaActual = 1;
    this.actualizarPagina();
  }

  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.usuariosPagina = this.usuariosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.paginaActual = n;
    this.actualizarPagina();
  }

  abrirModal(usuario: Usuario, accion: 'admin' | 'bloquear' | 'desbloquear') {
    this.usuarioSeleccionado = usuario;
    this.accionModal = accion;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  confirmarAccion() {
    if (!this.usuarioSeleccionado) return;
    
    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/usuarios'
      : 'https://jc-backend-mu05.onrender.com/api/usuarios';
    
    let endpoint = '';
    let mensajeExito = '';
    
    switch(this.accionModal) {
      case 'admin':
        endpoint = `${apiUrl}/${this.usuarioSeleccionado.id}/admin`;
        mensajeExito = 'Usuario promovido a administrador';
        break;
      case 'bloquear':
        endpoint = `${apiUrl}/${this.usuarioSeleccionado.id}/bloquear`;
        mensajeExito = 'Usuario bloqueado correctamente';
        break;
      case 'desbloquear':
        endpoint = `${apiUrl}/${this.usuarioSeleccionado.id}/desbloquear`;
        mensajeExito = 'Usuario desbloqueado correctamente';
        break;
    }
    
    this.cargando = true;
    
    this.http.put(endpoint, {}).subscribe({
      next: () => {
        this.mostrarMensaje(mensajeExito, false);
        this.cerrarModal();
        this.cargarUsuarios();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarMensaje(error.error?.error || 'Error al realizar la acción', true);
        this.cargando = false;
      }
    });
  }

  getTipoClass(tipo: string): string {
    switch(tipo) {
      case 'admin': return 'tipo-admin';
      case 'estudiante': return 'tipo-estudiante';
      case 'bibliotecario': return 'tipo-bibliotecario';
      default: return '';
    }
  }

  getTipoTexto(tipo: string): string {
    switch(tipo) {
      case 'admin': return 'Administrador';
      case 'estudiante': return 'Estudiante';
      case 'bibliotecario': return 'Bibliotecario';
      default: return tipo;
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'activo': return 'estado-activo';
      case 'bloqueado': return 'estado-bloqueado';
      case 'pendiente': return 'estado-pendiente';
      default: return '';
    }
  }

  getEstadoTexto(estado: string): string {
    switch(estado) {
      case 'activo': return 'Activo';
      case 'bloqueado': return 'Bloqueado';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  }

  mostrarMensaje(texto: string, error: boolean) {
    this.mensaje = texto;
    this.esError = error;
    setTimeout(() => this.mensaje = '', 3500);
  }
}