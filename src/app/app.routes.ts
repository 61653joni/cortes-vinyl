import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TerminosComponent } from './pages/terminos/terminos';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Libros } from './pages/admin/libros/libros';
import { Prestaciones } from './pages/admin/prestaciones/prestaciones';
import { Usuarios } from './pages/admin/usuarios/usuarios';
import { authGuard } from './guards/auth-guard';
import { VerifyEmailComponent } from './components/verify-email.component'; 
import { CategoriasComponent } from './pages/categorias/categorias';
import {Perfil} from './pages/perfil/perfil';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent }, // ✅ Agregar ruta explícita para /inicio
  { path: 'terminos', component: TerminosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'perfil', component: Perfil},
  
  // ✅ Rutas de categorías
    { path: 'categoria/:id', component: CategoriasComponent }, // ✅ Página pública
  { path: 'categoria', redirectTo: '/categoria/todos', pathMatch: 'full' }, // Redirigir
  
  // Dashboard con sus subrutas (los componentes están en admin)
  { 
    path: 'Dashboard', 
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: 'libros', component: Libros },
      { path: 'prestaciones', component: Prestaciones },
      { path: 'usuarios', component: Usuarios },
      { path: '', redirectTo: 'libros', pathMatch: 'full' }
    ]
  },

  // Redirige a inicio si no encuentra la ruta
  { path: '**', redirectTo: '' }
];