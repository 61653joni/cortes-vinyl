import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CarritoService } from '../../services/carrito';

interface Producto {
  nombre: string;
  artista: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {

  constructor(public carritoService: CarritoService) {}

  busqueda = '';

  productos: Producto[] = [
    {
      nombre: 'The Wall',
      artista: 'Pink Floyd',
      precio: 850,
      imagen: 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg'
    },
    {
      nombre: 'Greatest Hits',
      artista: 'Queen',
      precio: 720,
      imagen: 'https://upload.wikimedia.org/wikipedia/en/0/0e/Queen_Greatest_Hits.png'
    },
    {
      nombre: 'Nevermind',
      artista: 'Nirvana',
      precio: 790,
      imagen: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg'
    },
    {
      nombre: 'Random Access Memories',
      artista: 'Daft Punk',
      precio: 900,
      imagen: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg'
    }
  ];

  get productosFiltrados() {
    return this.productos.filter(p =>
      (p.nombre + p.artista).toLowerCase()
        .includes(this.busqueda.toLowerCase())
    );
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}