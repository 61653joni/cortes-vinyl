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

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}