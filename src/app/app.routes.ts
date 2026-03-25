import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TerminosComponent } from './pages/terminos/terminos';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: 'login', component: LoginComponent },
 { path: 'registro', component: RegistroComponent },
 { path: 'Dashboard', component: Dashboard },

  //evita errores de rutas
  { path: '**', redirectTo: '' }
]; 