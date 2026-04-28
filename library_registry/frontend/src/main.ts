// Angular alkalmazás belépési pontja

// Angular bootstrap függvény importálása
import { bootstrapApplication } from '@angular/platform-browser';
// Alkalmazás konfiguráció importálása
import { appConfig } from './app/app.config';
// Gyökérkomponens importálása
import { App } from './app/app';

// Az alkalmazás elindítása
bootstrapApplication(App, appConfig)
  // Hibakezelés: ha a bootstrap során hiba történik
  .catch((err) => console.error(err));