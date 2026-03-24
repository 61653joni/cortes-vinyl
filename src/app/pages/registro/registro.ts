import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  nombre = '';
  apellido = '';
  curp = '';
  telefono = '';
  email = '';
  password = '';

  constructor(private supabaseService: SupabaseService) {}

  async registrar() {

    if (!this.email || !this.password) {
      alert('Correo y contraseña obligatorios');
      return;
    }

    const client = this.supabaseService['supabase'];

    const { data, error } = await client
      .from('usuarios')
      .insert([{
        nombre: this.nombre,
        apellido: this.apellido,
        curp: this.curp,
        telefono: this.telefono,
        email: this.email,
        password: this.password,
        tipo_usu: 'estudiante'
      }]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Usuario registrado');
      console.log(data);
    }

  }

}