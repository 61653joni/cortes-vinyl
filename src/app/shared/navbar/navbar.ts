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

  get esAdmin() {
    return this.usuario?.tipo === 'admin';
  }

 irHome() {
  const tipo = this.usuario?.tipo?.toLowerCase();

  if (tipo === 'admin') {
    this.router.navigate(['/Dashboard']);
  } else {
    this.router.navigate(['/inicio']);
  }
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