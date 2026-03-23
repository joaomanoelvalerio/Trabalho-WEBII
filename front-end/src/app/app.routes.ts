import { Routes } from '@angular/router';
import { LoginComponent } from './features/authentication/login/login';
import { RegisterComponent } from './features/authentication/register/register';
import { Employee } from './features/employee/employee';
import { ClientHomeComponent } from './features/client/client-home/client-home';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './features/authentication/guards/no.auth-guard';

export const routes: Routes = [
  { path: 'login',    component: LoginComponent      /*, canActivate: [noAuthGuard]*/ },
  { path: 'register', component: RegisterComponent   /*, canActivate: [noAuthGuard]*/ },
  { path: 'employee', component: Employee   /*, canActivate: [authGuard]*/ },
  { path: 'client',   component: ClientHomeComponent /*, canActivate: [authGuard]*/ },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];