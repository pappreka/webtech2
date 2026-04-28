//Validációs séma

// Zod validációs könyvtár importálása
const { z } = require("zod");
// Saját ISBN ellenőrző függvény importálása
const { isValidIsbn } = require("../utils/isbn");

// Könyv létrehozásához szükséges validációs séma
const bookCreateSchema = z.object({
  // Könyv címe (legalább 1 karakter)
  title: z.string().min(1),
  // Szerző neve (legalább 1 karakter)
  author: z.string().min(1),
  // ISBN mező
  isbn: z.string()
  .min(10)
  .max(17)
  .regex(/^(\d[-\s]?){9}[\dXx]$|^(\d[-\s]?){13}$/, {
    message: "ISBN must be ISBN-10 or ISBN-13 format"
  }),
  // Kiadási év (opcionális)
  year: z.number()
    .int() // csak egész szám lehet
    .min(0) // minimum 0
    .max(3000) // maximum 3000
    .optional(), // nem kötelező mező
  // Példányszám
  copies: z.number()
    .int() // egész szám
    .min(0) // nem lehet negatív
    .default(1), // ha nincs megadva → 1 lesz az alapértelmezett
});

// Séma exportálása más fájlok számára
module.exports = { bookCreateSchema };