import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink], // ← ESTO ES CLAVE
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {}