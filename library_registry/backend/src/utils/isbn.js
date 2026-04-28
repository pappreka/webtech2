// ISBN szám ellenőrzése (ISBN-10 és ISBN-13 támogatással)

// ISBN tisztítása: szóközök és kötőjelek eltávolítása
function cleanIsbn(input) {
  return String(input) // biztosítjuk, hogy string legyen
    .replace(/[\s-]/g, "") // szóközök és "-" eltávolítása
    .toUpperCase(); // nagybetűsítés (X miatt fontos)
}

// ISBN-10 ellenőrzése
function isValidIsbn10(isbn10) {
  // Formátum ellenőrzés:
  // 9 számjegy + utolsó karakter szám vagy 'X'
  if (!/^\d{9}[\dX]$/.test(isbn10)) return false;

  let sum = 0;

  // Súlyozott összeg számítása
  for (let i = 0; i < 10; i++) {
    const ch = isbn10[i];

    // 'X' = 10, egyébként számjegy
    const val = ch === "X" 
      ? 10 
      : (ch.charCodeAt(0) - 48); // karakter → szám

    // Súlyozás: 10-től 1-ig csökken
    sum += val * (10 - i);
  }

  // Akkor érvényes, ha az összeg osztható 11-gyel
  return sum % 11 === 0;
}

// ISBN-13 ellenőrzése
function isValidIsbn13(isbn13) {
  // Pontosan 13 számjegy kell
  if (!/^\d{13}$/.test(isbn13)) return false;

  let sum = 0;

  // Az első 12 számjegy feldolgozása
  for (let i = 0; i < 12; i++) {
    const d = isbn13.charCodeAt(i) - 48; // karakter → szám

    // Páros index: *1, páratlan index: *3
    sum += d * (i % 2 === 0 ? 1 : 3);
  }

  // Ellenőrző számjegy kiszámítása
  const check = (10 - (sum % 10)) % 10;

  // Az utolsó számjegy (ellenőrző számjegy)
  const last = isbn13.charCodeAt(12) - 48;

  // Akkor érvényes, ha egyezik
  return check === last;
}

// Általános ISBN ellenőrző függvény
function isValidIsbn(input) {
  const s = cleanIsbn(input); // bemenet tisztítása

  // Hossz alapján eldöntjük a típust
  if (s.length === 10) return isValidIsbn10(s);
  if (s.length === 13) return isValidIsbn13(s);

  // Egyéb hossz → érvénytelen
  return false;
}

// Exportáljuk a függvényeket
module.exports = { cleanIsbn, isValidIsbn };