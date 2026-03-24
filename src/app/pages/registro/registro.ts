import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  nombre = '';
  apellido = '';
  curp = '';
  telefono = '';
  email = '';

  constructor(private supabase: SupabaseService) {}

  async registrar() {

    const { data, error } = await this.supabase['supabase']
      .from('usuarios')
      .insert([{
        nombre: this.nombre,
        apellido: this.apellido,
        curp: this.curp,
        telefono: this.telefono,
        email: this.email
      }]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Usuario registrado');
      console.log(data);
    }

  }

}