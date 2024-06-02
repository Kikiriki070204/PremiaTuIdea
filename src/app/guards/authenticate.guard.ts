import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { Observable } from 'rxjs';

export const authenticateGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService)
  let router = inject(Router)

  return new Observable<boolean>(observe => {  
    authService.meplus().subscribe({
      next(value) {
        observe.next(true)
      },
      error(err) {
        router.navigate(['/login'])
        console.log("going back to login")
      },
    })
  })
};
