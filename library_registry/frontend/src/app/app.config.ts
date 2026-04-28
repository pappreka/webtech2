// Fő Angular beállítások (ApplicationConfig)
// Itt történik az alkalmazás globális konfigurációja

import { ApplicationConfig } from '@angular/core'; // Angular app konfiguráció típus
import { provideRouter } from '@angular/router'; // routing biztosítása
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // HTTP kliens + interceptorok
import { provideAnimations } from '@angular/platform-browser/animations'; // animációk (Angular Material miatt is kell)

import { routes } from './app.routes'; // route definíciók
import { authInterceptor } from './interceptors/auth-interceptor'; // saját interceptor (JWT hozzáadás)

// Alkalmazás konfiguráció
export const appConfig: ApplicationConfig = {
  providers: [
    // Router beállítása az alkalmazás route-jaival
    provideRouter(routes),
    // Animációk engedélyezése (pl. Material komponensekhez)
    provideAnimations(),
    // HTTP kliens konfigurálása interceptorral
    provideHttpClient(
      withInterceptors([
        authInterceptor // minden HTTP kéréshez token hozzáadása
      ])
    ),
  ],
};