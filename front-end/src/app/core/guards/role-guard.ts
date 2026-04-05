import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';

/** Permite apenas CLIENT */
export const clientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getLoggedInUser();

  if (user?.role === 'CLIENT') return true;

  // Funcionário tentando acessar rota de cliente → redireciona para área dele
  if (user?.role === 'EMPLOYEE' || user?.role === 'ADMIN') {
    router.navigate(['/employee']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};

/** Permite apenas EMPLOYEE ou ADMIN */
export const employeeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getLoggedInUser();

  if (user?.role === 'EMPLOYEE' || user?.role === 'ADMIN') return true;

  // Cliente tentando acessar rota de funcionário → redireciona para área dele
  if (user?.role === 'CLIENT') {
    router.navigate(['/client']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};