// Jogosultság ellenőrzés (route guard Angular-ben)

import { CanActivateFn } from '@angular/router'; // Guard típus importálása

// Auth guard definíció
// Meghatározza, hogy egy adott route aktiválható-e
export const authGuard: CanActivateFn = (route, state) => {
  // route → az aktuális útvonal adatai
  // state → a teljes router állapot (pl. URL)
  // Jelenleg mindig true-t ad vissza → mindenki hozzáfér
  return true;
};