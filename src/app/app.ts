import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/navbar/navbar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule,NavbarComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
 constructor(public router: Router) {}

 esAdminRoute(): boolean {
  return this.router.url.startsWith('/Dashboard');
}
  busqueda: string = '';



}

