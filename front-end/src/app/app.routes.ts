import { Routes } from '@angular/router';
import { LoginComponent } from './features/authentication/login/login';
import { RegisterComponent } from './features/authentication/register/register';
import { Employee } from './features/employee/employee';
import { ClientHomeComponent } from './features/client/client-home/client-home';
import { ClientNewRequest } from './features/client/client-new-request/client-new-request';
import { SolicitationsListComponent } from './features/employee/solicitations-list/solicitations-list';
import { RevenueReportsComponent } from './features/employee/revenue-reports/revenue-reports';
import { ManageCategoriesComponent } from './features/employee/manage-categories/manage-categories';
import { ManageEmployeesComponent } from './features/employee/manage-employees/manage-employees';
import { noAuthGuard } from './features/authentication/guards/no.auth-guard';
import { clientGuard, employeeGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: 'login',                    component: LoginComponent,              canActivate: [noAuthGuard]   },
  { path: 'register',                 component: RegisterComponent,           canActivate: [noAuthGuard]   },
  { path: 'client',                   component: ClientHomeComponent,         canActivate: [clientGuard]   },
  { path: 'client/new-request',       component: ClientNewRequest,            canActivate: [clientGuard]   },
  { path: 'employee',                 component: Employee,                    canActivate: [employeeGuard] },
  { path: 'employee/solicitations',   component: SolicitationsListComponent,  canActivate: [employeeGuard] },
  { path: 'employee/reports',         component: RevenueReportsComponent,     canActivate: [employeeGuard] },
  { path: 'employee/categories',      component: ManageCategoriesComponent,   canActivate: [employeeGuard] },
  { path: 'employee/employees',       component: ManageEmployeesComponent,    canActivate: [employeeGuard] },
  { path: '',                         redirectTo: '/login',                   pathMatch: 'full'            },
  { path: '**',                       redirectTo: '/login'                                                 },
];