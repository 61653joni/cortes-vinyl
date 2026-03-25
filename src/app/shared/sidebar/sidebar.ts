import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  usuario: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.usuario$.subscribe(u => this.usuario = u);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}