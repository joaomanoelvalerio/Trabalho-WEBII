import { Routes } from '@angular/router';
import { LoginComponent } from './features/authentication/login/login';
import { RegisterComponent } from './features/authentication/register/register';
import { Employee } from './features/employee/employee';
import { ClientHomeComponent } from './features/client/client-home/client-home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employee', component: Employee },
  { path: 'client', component: ClientHomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];