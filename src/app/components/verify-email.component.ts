// src/app/components/verify-email/verify-email.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.html',  // 👈 Apunta al HTML
  styleUrl: './verify-email.css'       // 👈 Apunta al CSS
})
export class VerifyEmailComponent implements OnInit {
  isLoading: boolean = true;
  isSuccess: boolean = false;
  errorMessage: string = '';
  email: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'] || '';
    
    if (this.token) {
      this.verifyToken();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Enlace de verificación inválido. Asegúrate de usar el enlace completo que recibiste en tu correo.';
    }
  }

  async verifyToken() {
    try {
      const response: any = await this.authService.verificarEmail(this.token).toPromise();
      this.isLoading = false;
      this.isSuccess = true;
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.error?.error || 'El enlace de verificación no es válido o ha expirado.';
    }
  }

  async resendVerification() {
    if (!this.email) {
      const emailInput = prompt('Por favor ingresa tu correo electrónico:');
      if (!emailInput) return;
      this.email = emailInput;
    }
    
    try {
      await this.authService.reenviarVerificacion(this.email).toPromise();
      alert('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      alert(error.error?.error || 'Error al reenviar el correo.');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}