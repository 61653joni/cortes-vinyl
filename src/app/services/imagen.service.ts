import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/upload'
    : 'https://jc-backend-mu05.onrender.com/api/upload';

  constructor(private http: HttpClient) {}

  subirImagen(archivo: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    
    return this.http.post<{ url: string }>(this.apiUrl, formData);
  }
}