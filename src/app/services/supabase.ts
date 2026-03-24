import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // ======================
  // USUARIOS
  // ======================
  async getUsuarios() {
    return await this.supabase.from('usuarios').select('*');
  }

  async crearUsuario(usuario: any) {
    return await this.supabase.from('usuarios').insert([usuario]);
  }

  // ======================
  // LIBROS
  // ======================
  async getLibros() {
    return await this.supabase.from('libros').select('*');
  }

  async crearLibro(libro: any) {
    return await this.supabase.from('libros').insert([libro]);
  }

  // ======================
  // PRÉSTAMOS
  // ======================
  async getPrestamos() {
    return await this.supabase.from('prestamos').select('*');
  }

  async crearPrestamo(prestamo: any) {
    return await this.supabase.from('prestamos').insert([prestamo]);
  }

  async devolverLibro(idPrestamo: string, idLibro: string) {
    // marcar préstamo como devuelto
    await this.supabase
      .from('prestamos')
      .update({
        estado: 'devuelto',
        fecha_devolucion: new Date()
      })
      .eq('id', idPrestamo);

    // aumentar disponibilidad
    await this.supabase.rpc('incrementar_libro', {
      libro_id: idLibro
    });
  }

}