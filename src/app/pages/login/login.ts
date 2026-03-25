import { Component } from '@angular/core';
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
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (data: any) => {
        this.errorMessage = '';
        this.authService.setUsuario(data);
        
        if (data.tipo_usu === 'admin') {
          this.router.navigate(['/Dashboard']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });
  }
}