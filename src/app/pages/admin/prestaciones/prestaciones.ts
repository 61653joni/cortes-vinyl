// src/app/pages/admin/prestaciones/prestaciones.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestacionesService } from '../../../services/prestaciones.service';
import { LibrosService } from '../../../services/ibros.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface Prestamo {
  id: string;
  id_libro: string;
  id_usuario: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_devolucion?: string;
  estado: 'activo' | 'devuelto' | 'vencido' | 'cancelado';
  titulo?: string;
  autor?: string;
  libros?: {
    titulo: string;
    autor: string;
  };
  nombre?: string;
  email?: string;
  usuarios?: {
    nombre: string;
    email: string;
  };
}

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn?: string;
  categoria_id?: string;
  cantidad_total: number;
  cantidad_disponible: number;
  imagen_url?: string;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo_usu: string;
}

@Component({
  selector: 'app-prestaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestaciones.html',
  styleUrl: './prestaciones.css'
})
export class Prestaciones implements OnInit {
  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  usuarios: Usuario[] = [];  // ✅ Lista de usuarios disponibles
  prestamosActivos = 0;
  
  nuevoPrestamo = {
    id_libro: '',
    id_usuario: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    estado: 'activo' as const
  };
  
  prestamoSeleccionado: Prestamo | null = null;
  mostrarFormulario = false;
  mensaje = '';
  esError = false;
  cargando = false;
  
  // Filtros
  filtroEstado = 'todos';
  filtroUsuario = '';
  prestamosFiltrados: Prestamo[] = [];
  prestamosPagina: Prestamo[] = [];
  paginaActual = 1;
  readonly porPagina = 10;
  
  today = new Date().toISOString().split('T')[0];

  constructor(
    private prestacionesService: PrestacionesService,
    private librosService: LibrosService,
    private authService: AuthService,
    private http: HttpClient  // ✅ Agregar HttpClient para usuarios
  ) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarUsuarios();  // ✅ Cargar usuarios
  }
  
  // ✅ Nuevo método para cargar usuarios
  cargarUsuarios() {
    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api/usuarios'
      : 'https://jc-backend-mu05.onrender.com/api/usuarios';
    
    this.http.get<Usuario[]>(apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data.filter(usuario => usuario.tipo_usu !== 'admin');
      console.log('👥 Usuarios disponibles para préstamos:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }
  
  cargarDatos() {
    this.cargando = true;
    this.prestacionesService.getPrestamos().subscribe({
      next: (data: Prestamo[]) => {
        console.log('📊 Datos de préstamos:', data);
        this.prestamos = data;
        this.prestamosActivos = data.filter((p: Prestamo) => p.estado === 'activo').length;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar préstamos:', error);
        this.mostrarMensaje('Error al cargar préstamos: ' + (error.error?.error || error.message), true);
        this.cargando = false;
      }
    });
    
    this.librosService.getLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data;
      },
      error: (error) => console.error('Error al cargar libros:', error)
    });
  }

  get totalPaginas() {
    return Math.ceil(this.prestamosFiltrados.length / this.porPagina) || 1;
  }

aplicarFiltros() {
  let filtrados: Prestamo[] = [...this.prestamos];
  
  // Filtro por estado
  if (this.filtroEstado !== 'todos') {
    filtrados = filtrados.filter((p: Prestamo) => p.estado === this.filtroEstado);
  }
  
  // ✅ Filtro por usuario (ahora funciona correctamente)
  if (this.filtroUsuario) {
    // filtroUsuario contiene el ID del usuario seleccionado
    filtrados = filtrados.filter((p: Prestamo) => p.id_usuario === this.filtroUsuario);
  }
  
  this.prestamosFiltrados = filtrados;
  this.prestamosActivos = this.prestamos.filter((p: Prestamo) => p.estado === 'activo').length;
  this.paginaActual = 1;
  this.actualizarPagina();
}
  
  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.prestamosPagina = this.prestamosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.paginaActual = n;
    this.actualizarPagina();
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.nuevoPrestamo = {
      id_libro: '',
      id_usuario: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      estado: 'activo'
    };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.prestamoSeleccionado = null;
  }

  crearPrestamo() {
    if (!this.nuevoPrestamo.id_libro) {
      this.mostrarMensaje('Selecciona un libro', true);
      return;
    }
    
    if (!this.nuevoPrestamo.id_usuario) {
      this.mostrarMensaje('Selecciona un usuario', true);
      return;
    }
    
    if (!this.nuevoPrestamo.fecha_fin) {
      this.mostrarMensaje('Ingresa la fecha de devolución', true);
      return;
    }
    
    // Verificar disponibilidad del libro
    const libro = this.libros.find((l: Libro) => l.id === this.nuevoPrestamo.id_libro);
    if (libro && libro.cantidad_disponible <= 0) {
      this.mostrarMensaje('No hay ejemplares disponibles de este libro', true);
      return;
    }
    
    this.cargando = true;
    
    console.log('📝 Creando préstamo:', this.nuevoPrestamo);
    
    this.prestacionesService.crearPrestamo(this.nuevoPrestamo).subscribe({
      next: (response) => {
        console.log('✅ Préstamo creado:', response);
        this.mostrarMensaje('Préstamo creado exitosamente', false);
        this.cerrarFormulario();
        this.cargarDatos();
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error al crear préstamo:', error);
        this.mostrarMensaje(error.error?.error || 'Error al crear préstamo', true);
        this.cargando = false;
      }
    });
  }

  registrarDevolucion(prestamo: Prestamo) {
    const titulo = prestamo.titulo || prestamo.libros?.titulo || 'este libro';
    if (!confirm(`¿Registrar devolución del libro "${titulo}"?`)) return;
    
    this.cargando = true;
    this.prestacionesService.registrarDevolucion(prestamo.id).subscribe({
      next: () => {
        this.mostrarMensaje('Devolución registrada exitosamente', false);
        this.cargarDatos();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al registrar devolución:', error);
        this.mostrarMensaje(error.error?.error || 'Error al registrar devolución', true);
        this.cargando = false;
      }
    });
  }

  cancelarPrestamo(prestamo: Prestamo) {
    const titulo = prestamo.titulo || prestamo.libros?.titulo || 'este libro';
    if (!confirm(`¿Cancelar préstamo del libro "${titulo}"?`)) return;
    
    this.cargando = true;
    this.prestacionesService.cancelarPrestamo(prestamo.id).subscribe({
      next: () => {
        this.mostrarMensaje('Préstamo cancelado', false);
        this.cargarDatos();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cancelar préstamo:', error);
        this.mostrarMensaje(error.error?.error || 'Error al cancelar préstamo', true);
        this.cargando = false;
      }
    });
  }

  // ✅ Método para obtener nombre del usuario por ID
  getUsuarioNombre(id_usuario: string): string {
    const usuario = this.usuarios.find(u => u.id === id_usuario);
    return usuario ? `${usuario.nombre} (${usuario.email})` : id_usuario;
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'activo': return 'estado-activo';
      case 'devuelto': return 'estado-devuelto';
      case 'vencido': return 'estado-vencido';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  }

  getEstadoTexto(estado: string): string {
    switch(estado) {
      case 'activo': return 'Activo';
      case 'devuelto': return 'Devuelto';
      case 'vencido': return 'Vencido';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  mostrarMensaje(texto: string, error: boolean) {
    this.mensaje = texto;
    this.esError = error;
    setTimeout(() => this.mensaje = '', 3500);
  }
}