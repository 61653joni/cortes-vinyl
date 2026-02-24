import { Injectable } from '@angular/core';

interface Producto {
  nombre: string;
  artista: string;
  precio: number;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  carrito: Producto[] = [];

  agregar(producto: Producto) {
    this.carrito.push(producto);
  }

  get total() {
    return this.carrito.reduce((acc, p) => acc + p.precio, 0);
  }

}