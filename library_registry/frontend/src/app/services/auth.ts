// Hálózati kommunikáció az API felé (AuthService)
// Feladata: login, register, token kezelés

import { Injectable } from '@angular/core'; // Angular service
import { HttpClient } from '@angular/common/http'; // HTTP kérésekhez
import { environment } from '../../environments/environment'; // környezeti változók (pl. API URL)
import { tap } from 'rxjs/operators'; // mellékhatások kezelésére
import { Observable } from 'rxjs'; // Observable típus

// Login válasz típusa
type LoginResponse = { 
  token: string; 
  username: string 
};

// Service definíció (globálisan elérhető)
@Injectable({ providedIn: 'root' })
export class AuthService {

  // Token tárolás kulcsa a localStorage-ben
  private tokenKey = 'library_token';

  constructor(private http: HttpClient) {}

  // Bejelentkezés
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      // POST kérés a backend login endpointjára
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      // Siker esetén a token mentése localStorage-be
      .pipe(
        tap((res) => localStorage.setItem(this.tokenKey, res.token))
      );
  }

  // Regisztráció
  register(username: string, password: string) {
    return this.http
      // POST kérés a register endpointra
      .post<LoginResponse>(`${environment.apiUrl}/auth/register`, { username, password })
      // Token mentése (automatikus bejelentkezés regisztráció után)
      .pipe(
        tap((res) => localStorage.setItem(this.tokenKey, res.token))
      );
  }

  // Kijelentkezés
  logout() {
    // Token törlése
    localStorage.removeItem(this.tokenKey);
  }

  // Token lekérdezése (getter)
  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Bejelentkezett állapot ellenőrzése
  get isLoggedIn(): boolean {
    return !!this.token; // true ha van token
  }
}