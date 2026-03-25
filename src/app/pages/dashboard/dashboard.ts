import { Component } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router'; // ← ESTE

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar, RouterOutlet], // ← AQUÍ
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  usuario: any;

  constructor(private auth: AuthService) {
    this.usuario = this.auth.usuario;
  }

  logout() {
    this.auth.logout();
  }
}