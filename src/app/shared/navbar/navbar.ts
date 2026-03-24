import { Component, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  usuario: any = null;
  menuAbierto = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.usuario$.subscribe(u => this.usuario = u);
  }

  @HostListener('document:click', ['$event'])
  cerrarMenu(event: Event) {
    const el = event.target as HTMLElement;
    if (!el.closest('.user-menu')) this.menuAbierto = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}