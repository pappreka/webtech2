// HTTP interceptor (Angular)
// Feladata: minden kéréshez automatikusan hozzáadja a JWT tokent

import { HttpInterceptorFn } from '@angular/common/http'; // interceptor típus
import { inject } from '@angular/core'; // dependency injection használata
import { AuthService } from '../services/auth'; // saját auth service

// Interceptor definíció
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // AuthService példány lekérése (Angular DI)
  const auth = inject(AuthService);
  // Token lekérése a service-ből
  const token = auth.token;

  // Ha nincs token → változtatás nélkül továbbküldjük a kérést
  if (!token) return next(req);

  // Ha van token → módosítjuk a requestet
  return next(
    req.clone({
      // Authorization header hozzáadása (Bearer token)
      setHeaders: { 
        Authorization: `Bearer ${token}` 
      },
    })
  );
};