import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibrosService } from '../../../services/ibros.service';
import { CategoriasService } from '../../../services/categorias.service';
import { ImagenService } from '../../../services/imagen.service';  // ✅ Importar

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
    cantidad_disponible: 1,
    imagen_url: ''
  };
  
  mensaje = '';
  esError = false;
  
  // Variables para manejo de imágenes
  archivoImagen: File | null = null;
  vistaPrevia: string | null = null;
  subiendo = false;  // Estado de carga

  constructor(
    private librosService: LibrosService,
    private categoriasService: CategoriasService,
    private imagenService: ImagenService  // ✅ Agregar
  ) {}

  ngOnInit() {
    this.cargarLibros();
    this.cargarCategorias();
  }

  cargarLibros() {
    this.librosService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarMensaje('Error al cargar libros', true);
      }
    });
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoImagen = input.files[0];
      
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
      if (!tiposPermitidos.includes(this.archivoImagen.type)) {
        this.mostrarMensaje('Formato no permitido. Usa JPG, PNG o WEBP', true);
        this.limpiarImagen();
        return;
      }
      
      if (this.archivoImagen.size > 2 * 1024 * 1024) {
        this.mostrarMensaje('La imagen no debe superar los 2MB', true);
        this.limpiarImagen();
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        this.vistaPrevia = reader.result as string;
      };
      reader.readAsDataURL(this.archivoImagen);
      
      this.nuevoLibro.imagen_url = '';
    }
  }

  limpiarImagen() {
    this.archivoImagen = null;
    this.vistaPrevia = null;
    this.nuevoLibro.imagen_url = '';
  }

  // ✅ Guardar libro usando el backend (ImagenService)
  async guardarLibro() {
    if (!this.nuevoLibro.titulo || !this.nuevoLibro.autor) {
      this.mostrarMensaje('Título y autor son obligatorios', true);
      return;
    }

    this.subiendo = true;
    this.mostrarMensaje('📤 Guardando libro...', false);

    try {
      let imagenUrl = this.nuevoLibro.imagen_url;
      
      if (this.archivoImagen) {
        this.mostrarMensaje('📤 Subiendo imagen...', false);
        const response = await this.imagenService.subirImagen(this.archivoImagen).toPromise();
        imagenUrl = response!.url;
      }
      
      const libroData = {
        ...this.nuevoLibro,
        imagen_url: imagenUrl
      };
      
      this.librosService.crearLibro(libroData).subscribe({
        next: () => {
          this.mostrarMensaje('✅ Libro guardado correctamente', false);
          this.resetFormulario();
          this.cargarLibros();
          this.subiendo = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarMensaje('❌ Error al guardar libro', true);
          this.subiendo = false;
        }
      });
      
    } catch (error) {
      console.error('Error al subir imagen:', error);
      this.mostrarMensaje('❌ Error al subir la imagen', true);
      this.subiendo = false;
    }
  }

  eliminarLibro(id: string) {
    if (confirm('¿Eliminar este libro?')) {
      this.librosService.eliminarLibro(id).subscribe({
        next: () => {
          this.mostrarMensaje('✅ Libro eliminado', false);
          this.cargarLibros();
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarMensaje('❌ Error al eliminar', true);
        }
      });
    }
  }

  resetFormulario() {
    this.nuevoLibro = {
      titulo: '',
      autor: '',
      isbn: '',
      categoria_id: '',
      cantidad_total: 1,
      cantidad_disponible: 1,
      imagen_url: ''
    };
    this.limpiarImagen();
  }

  mostrarMensaje(texto: string, error: boolean) {
    this.mensaje = texto;
    this.esError = error;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }
}