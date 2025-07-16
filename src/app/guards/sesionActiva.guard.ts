import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const sesionActivaGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const rol = authService.getRoleId()

    if (rol) {
        router.navigate(['/dashboard']);
        return false;
    }

    return true;


};