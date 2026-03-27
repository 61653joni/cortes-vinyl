// src/app/components/navbar/navbar.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoriasService } from '../../services/categorias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  usuario: any = null;
  menuAbierto = false;
  categorias: any[] = [];

  constructor(
    private authService: AuthService, 
    private router: Router,
    private categoriasService: CategoriasService
  ) {
    this.authService.usuario$.subscribe(u => this.usuario = u);
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        console.log('📚 Categorías cargadas:', this.categorias);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        // Categorías por defecto en caso de error
        this.categorias = [
          { id: 1, nombre: 'Ficción' },
          { id: 2, nombre: 'Historia' },
          { id: 3, nombre: 'Ciencia' },
          { id: 4, nombre: 'Desarrollo Personal' },
          { id: 5, nombre: 'Infantil' },
          { id: 6, nombre: 'Clásicos' }
        ];
      }
    });
  }

  get esAdmin() {
    return this.usuario?.tipo_usu === 'admin';
  }

  irHome() {
    const tipo = this.usuario?.tipo_usu?.toLowerCase();

    if (tipo === 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  @HostListener('document:click', ['$event'])
  cerrarMenu(event: Event) {
    const el = event.target as HTMLElement;
    if (!el.closest('.user-menu')) this.menuAbierto = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}