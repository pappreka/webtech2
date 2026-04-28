// ISBN validáció (gépelés közben Angular formokhoz)

// Angular form validátor típusok
import { AbstractControl, ValidationErrors } from '@angular/forms';

// ISBN tisztítása (szóközök és kötőjelek eltávolítása)
function cleanIsbn(input: string): string {
  return String(input)
    .replace(/[\s-]/g, '') // szóköz és "-" törlése
    .toUpperCase(); // nagybetűsítés (X miatt fontos)
}

// ISBN-10 ellenőrzés
function isValidIsbn10(s: string): boolean {
  // Formátum ellenőrzés: 9 számjegy + 1 szám vagy X
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  // Súlyozott összeg számítása
  for (let i = 0; i < 10; i++) {
    const ch = s[i];
    // 'X' = 10, különben karakterből szám
    const val = ch === 'X' 
      ? 10 
      : (ch.charCodeAt(0) - 48);
    // Súlyozás: 10-től csökken
    sum += val * (10 - i);
  }
  // Érvényes, ha osztható 11-gyel
  return sum % 11 === 0;
}

// ISBN-13 ellenőrzés
function isValidIsbn13(s: string): boolean {
  // Pontosan 13 számjegy kell
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  // Az első 12 számjegy feldolgozása
  for (let i = 0; i < 12; i++) {
    const d = s.charCodeAt(i) - 48;
    // Páros index: *1, páratlan: *3
    sum += d * (i % 2 === 0 ? 1 : 3);
  }
  // Ellenőrző számjegy számítása
  const check = (10 - (sum % 10)) % 10;
  // Utolsó számjegy
  const last = s.charCodeAt(12) - 48;
  // Akkor érvényes, ha egyezik
  return check === last;
}

// Angular form validator függvény
export function isbnValidator(control: AbstractControl): ValidationErrors | null {
  // Nyers érték kiolvasása
  const raw = (control.value ?? '').toString();
  // Ha üres → nem itt hibázunk (required külön validator)
  if (!raw) return null;

  // Tisztított ISBN
  const s = cleanIsbn(raw);

  // Érvényesség ellenőrzése (ISBN-10 vagy ISBN-13)
  const ok =
    (s.length === 10 && isValidIsbn10(s)) ||
    (s.length === 13 && isValidIsbn13(s));

  // Ha valid → null (nincs hiba), különben hiba objektum
  return ok ? null : { isbn: true };
}