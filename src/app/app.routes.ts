import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TerminosComponent } from './pages/terminos/terminos';

export const routes: Routes = [
  { path: '', component: InicioComponent },
    { path: 'terminos', component: TerminosComponent }   
 
];