import { Routes } from '@angular/router';
import { NutricaoComponent } from './nutricao/nutricao.component';

export const routes: Routes = [
  { path: 'nutricao', component: NutricaoComponent },
  { path: '', redirectTo: 'nutricao', pathMatch: 'full' },
];
