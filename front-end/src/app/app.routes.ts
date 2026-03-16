// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login';
import { RegisterComponent } from './authentication/register/register';
import { FuncionarioComponent } from './funcionario/funcionario';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'funcionario', component: FuncionarioComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
