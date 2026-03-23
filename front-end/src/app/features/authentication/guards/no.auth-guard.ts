import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getLoggedInUser();

  if (!user) {
    return true;
  }

  if (user.perfil === 'cliente') {
    router.navigate(['/client']);
  } else {
    router.navigate(['/employee']);
  }

  return false;
};