// src/app/pages/categorias/categorias.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LibrosService } from '../../services/ibros.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {
  categoriaId: string | null = null;
  categoriaNombre: string = '';
  libros: any[] = [];
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private librosService: LibrosService,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoriaId = params.get('id');
      this.cargarLibrosPorCategoria();
    });
  }

  cargarLibrosPorCategoria() {
    this.cargando = true;
    
    this.librosService.getLibros().subscribe({
      next: (libros) => {
        if (this.categoriaId && this.categoriaId !== 'todos') {
          // Filtrar libros por categoría
          this.libros = libros.filter(libro => 
            libro.categoria_id?.toString() === this.categoriaId
          );
          
          // Obtener el nombre de la categoría
          this.categoriasService.getCategorias().subscribe({
            next: (categorias) => {
              const categoria = categorias.find(c => 
                c.id.toString() === this.categoriaId
              );
              this.categoriaNombre = categoria?.nombre || 'Categoría';
              this.cargando = false;
            },
            error: () => {
              this.categoriaNombre = 'Categoría';
              this.cargando = false;
            }
          });
        } else {
          // Mostrar todos los libros
          this.libros = libros;
          this.categoriaNombre = 'Todos los Libros';
          this.cargando = false;
        }
      },
      error: (err) => {
        this.error = 'Error al cargar los libros';
        this.cargando = false;
      }
    });
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/default-book.jpg';
  }

  estaDisponible(libro: any): boolean {
    return libro.cantidad_disponible > 0;
  }
}