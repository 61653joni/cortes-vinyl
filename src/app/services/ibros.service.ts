import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/libros'
    : 'https://jc-backend-mu05.onrender.com/api/libros';

  constructor(private http: HttpClient) {}

  getLibros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLibro(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearLibro(libro: any): Observable<any> {
    return this.http.post(this.apiUrl, libro);
  }

  actualizarLibro(id: string, libro: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, libro);
  }

  eliminarLibro(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}