import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const rol = authService.getRoleId();

    if (rol === 1 || rol === 2 || rol === 3) {
        return true;
    }

    router.navigate(['/dashboard']);
    return false;
};
