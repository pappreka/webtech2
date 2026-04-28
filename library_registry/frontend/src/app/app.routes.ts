// Angular routing konfiguráció
// Meghatározza, hogy mely URL milyen komponenst tölt be

import { Routes } from '@angular/router'; // route típus
import { Login } from './pages/login/login'; // login oldal
import { Register } from './pages/register/register'; // regisztrációs oldal
import { Books } from './pages/books/books'; // könyvek oldal
import { authGuard } from './guards/auth-guard'; // route guard (védelem)

// Route-ok definiálása
export const routes: Routes = [
  // /login → Login komponens
  { path: 'login', component: Login },
  // /register → Register komponens
  { path: 'register', component: Register },
  // /books → Books komponens
  // canActivate: csak akkor érhető el, ha a guard engedi (pl. be van jelentkezve)
  { path: 'books', component: Books, canActivate: [authGuard] },
  // Üres útvonal → átirányítás /books-ra
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  // Minden más (nem létező route) → átirányítás /books-ra
  { path: '**', redirectTo: 'books' },
];