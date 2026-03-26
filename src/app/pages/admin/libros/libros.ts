import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibrosService } from '../../../services/ibros.service';
import { CategoriasService } from '../../../services/categorias.service';
import { ImagenService } from '../../../services/imagen.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros implements OnInit {

  libros: any[] = [];
  categorias: any[] = [];

  nuevoLibro: any = {
    titulo: '',
    autor: '',
    isbn: '',
    categoria_id: '',
    cantidad_total: 1,
    // ✅ cantidad_disponible se calculará automáticamente, no se muestra en el formulario
    imagen_url: ''
  };

  mensaje = '';
  esError = false;
  modoEdicion = false;
  idEditando: string | null = null;

  archivoImagen: File | null = null;
  vistaPrevia: string | null = null;
  subiendo = false;

  // Lista / paginación / filtro
  listaVisible = true;
  filtroCategoria = '';
  librosFiltrados: any[] = [];
  librosPagina: any[] = [];
  paginaActual = 1;
  readonly porPagina = 10;

  constructor(
    private librosService: LibrosService,
    private categoriasService: CategoriasService,
    private imagenService: ImagenService
  ) {}

  ngOnInit() {
    this.cargarLibros();
    this.cargarCategorias();
  }

  get totalPaginas() {
    return Math.ceil(this.librosFiltrados.length / this.porPagina) || 1;
  }

  cargarLibros() {
    this.librosService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.aplicarFiltro();
      },
      error: () => this.mostrarMensaje('Error al cargar los libros', true)
    });
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: () => console.error('Error al cargar categorías')
    });
  }

  onFiltroChange() {
    this.paginaActual = 1;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    this.librosFiltrados = this.filtroCategoria
      ? this.libros.filter(l => String(l.categoria_id) === String(this.filtroCategoria))
      : [...this.libros];
    this.actualizarPagina();
  }

  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.librosPagina = this.librosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.paginaActual = n;
    this.actualizarPagina();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!tiposPermitidos.includes(archivo.type)) {
      this.mostrarMensaje('Formato no permitido. Usa JPG, PNG o WEBP', true);
      this.limpiarImagen();
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      this.mostrarMensaje('La imagen no debe superar los 2 MB', true);
      this.limpiarImagen();
      return;
    }

    this.archivoImagen = archivo;
    this.nuevoLibro.imagen_url = '';

    const reader = new FileReader();
    reader.onload = () => this.vistaPrevia = reader.result as string;
    reader.readAsDataURL(archivo);
  }

  limpiarImagen() {
    this.archivoImagen = null;
    this.vistaPrevia = null;
    this.nuevoLibro.imagen_url = '';
  }

  limpiarForm() {
    this.nuevoLibro = {
      titulo: '',
      autor: '',
      isbn: '',
      categoria_id: '',
      cantidad_total: 1,
      // ✅ cantidad_disponible no se incluye en el formulario
      imagen_url: ''
    };
    this.modoEdicion = false;
    this.idEditando = null;
    this.limpiarImagen();
  }

  async guardarLibro() {
    if (!this.nuevoLibro.titulo || !this.nuevoLibro.autor) {
      this.mostrarMensaje('El título y el autor son obligatorios', true);
      return;
    }

    this.subiendo = true;
    this.mostrarMensaje('Guardando libro...', false);

    try {
      let imagenUrl = this.nuevoLibro.imagen_url;

      if (this.archivoImagen) {
        this.mostrarMensaje('Subiendo imagen...', false);
        const response = await this.imagenService.subirImagen(this.archivoImagen).toPromise();
        imagenUrl = response!.url;
      }

      // ✅ IMPORTANTE: Al crear libro nuevo, cantidad_disponible = cantidad_total
      const libroData = { 
        ...this.nuevoLibro, 
        imagen_url: imagenUrl,
        cantidad_disponible: this.nuevoLibro.cantidad_total  // ✅ Automático
      };

      const operacion$ = this.modoEdicion && this.idEditando
        ? this.librosService.actualizarLibro(this.idEditando, libroData)
        : this.librosService.crearLibro(libroData);

      operacion$.subscribe({
        next: () => {
          this.mostrarMensaje(
            this.modoEdicion ? 'Libro actualizado correctamente' : 'Libro guardado correctamente',
            false
          );
          this.limpiarForm();
          this.cargarLibros();
          this.subiendo = false;
        },
        error: () => {
          this.mostrarMensaje('Error al guardar el libro', true);
          this.subiendo = false;
        }
      });

    } catch {
      this.mostrarMensaje('Error al subir la imagen', true);
      this.subiendo = false;
    }
  }

  eliminarLibro(id: string) {
    if (!confirm('¿Eliminar este libro?')) return;

    this.librosService.eliminarLibro(id).subscribe({
      next: () => {
        this.mostrarMensaje('Libro eliminado correctamente', false);
        this.cargarLibros();
      },
      error: () => this.mostrarMensaje('Error al eliminar el libro', true)
    });
  }

  editarLibro(libro: any) {
    this.nuevoLibro = { ...libro };
    this.modoEdicion = true;
    this.idEditando = libro.id;
    if (libro.imagen_url) {
      this.vistaPrevia = libro.imagen_url;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mostrarMensaje(texto: string, error: boolean) {
    this.mensaje = texto;
    this.esError = error;
    setTimeout(() => this.mensaje = '', 3500);
  }
}