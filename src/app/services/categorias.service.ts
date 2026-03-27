// src/app/services/categorias.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/categorias'
    : 'https://jc-backend-mu05.onrender.com/api/categorias';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las categorías
   */
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtener una categoría por ID
   */
  getCategoriaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear una nueva categoría
   */
  crearCategoria(categoria: { nombre: string; descripcion?: string }): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  /**
   * Actualizar una categoría existente
   */
  actualizarCategoria(id: string, categoria: { nombre: string; descripcion?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  /**
   * Eliminar una categoría
   */
  eliminarCategoria(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}