import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';

export const clientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getLoggedInUser();

  if (user?.role === 'CLIENT') return true;

  if (user?.role === 'EMPLOYEE' || user?.role === 'ADMIN') {
    router.navigate(['/employee']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};

export const employeeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getLoggedInUser();

  if (user?.role === 'EMPLOYEE' || user?.role === 'ADMIN') return true;

  if (user?.role === 'CLIENT') {
    router.navigate(['/client']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};