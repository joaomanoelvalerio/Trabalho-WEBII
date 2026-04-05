import { Routes } from '@angular/router';
import { LoginComponent } from './features/authentication/login/login';
import { RegisterComponent } from './features/authentication/register/register';
import { Employee } from './features/employee/employee';
import { ClientHomeComponent } from './features/client/client-home/client-home';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './features/authentication/guards/no.auth-guard';
import { ClientNewRequest } from './features/client/client-new-request/client-new-request';
import { SolicitationsListComponent } from './features/employee/solicitations-list/solicitations-list';
import { RevenueReportsComponent } from './features/employee/revenue-reports/revenue-reports';

export const routes: Routes = [
  { path: 'login',                  component: LoginComponent,             canActivate: [noAuthGuard] },
  { path: 'register',               component: RegisterComponent,          canActivate: [noAuthGuard] },
  { path: 'employee',               component: Employee,                   canActivate: [authGuard]   },
  { path: 'employee/solicitations', component: SolicitationsListComponent, canActivate: [authGuard]   },
  { path: 'employee/reports',       component: RevenueReportsComponent,    canActivate: [authGuard]   },
  { path: 'client',                 component: ClientHomeComponent,        canActivate: [authGuard]   },
  { path: 'client/new-request',     component: ClientNewRequest,           canActivate: [authGuard]   },
  { path: '',                       redirectTo: '/login',                  pathMatch: 'full'          },
  { path: '**',                     redirectTo: '/login'                                              },
];
