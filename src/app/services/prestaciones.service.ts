// src/app/services/prestaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestacionesService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/prestamos'
    : 'https://jc-backend-mu05.onrender.com/api/prestamos';

  constructor(private http: HttpClient) {}

  // Obtener todos los préstamos
  getPrestamos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear nuevo préstamo
  crearPrestamo(prestamo: any): Observable<any> {
    return this.http.post(this.apiUrl, prestamo);
  }

  // Registrar devolución
  registrarDevolucion(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/devolver`, {});
  }

  // Obtener préstamos activos de un usuario
  getPrestamosActivosPorUsuario(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}/activos`);
  }

  // Cancelar préstamo
  cancelarPrestamo(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, {});
  }
}