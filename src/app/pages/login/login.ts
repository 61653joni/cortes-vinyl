import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private authService: AuthService
  ) { }

  async login() {

    const client = this.supabaseService['supabase'];

    const { data, error } = await client
      .from('usuarios')
      .select('*')
      .eq('email', this.email)
      .eq('password', this.password)
      .single();

    if (error || !data) {
      this.errorMessage = 'Correo o contraseña incorrectos'; // ← Asigna el mensaje
      return;
    }

    this.errorMessage = '';

     this.authService.setUsuario({
      id: data.id,
      email: data.email,
      nombre: data.nombre 
    });

    // REDIRECCIÓN
    this.router.navigate(['/inicio']); // ← aquí cambias la ruta

  }

}