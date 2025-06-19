import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const isAuthenticatedGuard: CanActivateFn = async (route, state) => {
  let isAuthenticated = false;

  let authService = inject(AuthService);
  let router = inject(Router);
  
  isAuthenticated = await authService.isAuthenticated();

  if (!isAuthenticated){
    router.navigate(['user','login'])
  }

  return isAuthenticated;
};
