import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink], // ← ESTO FALTABA
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async login() {
    const client = this.supabaseService['supabase'];

    const { data, error } = await client.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Login correcto');
      console.log(data);
    }
  }

}