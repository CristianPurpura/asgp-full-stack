import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const empleadoOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (user && user.rol === 'EMPLEADO') {
    return true;
  }

  // Redirigir según rol: admin al dashboard, otros al login
  if (user?.rol === 'ADMIN') {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
