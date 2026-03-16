import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login';
import { RegisterComponent } from './authentication/register/register';
import { FuncionarioComponent } from './funcionario/funcionario';
import { ClientHomeComponent } from './client/client-home/client-home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'funcionario', component: FuncionarioComponent },
  { path: 'client', component: ClientHomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];