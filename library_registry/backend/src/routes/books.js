// Könyvek kezeléséért felelős router

const express = require("express"); // Express import
const Book = require("../models/Book"); // Book modell
const { auth } = require("../middleware/auth"); // autentikációs middleware
const { bookCreateSchema } = require("../validation/book"); // validációs séma (pl. Zod)

const router = express.Router(); // Router létrehozása

// GET /books
// Lekéri a bejelentkezett felhasználó összes könyvét
router.get("/", auth, async (req, res) => {
  // Csak a saját könyveket kérjük le (owner = user azonosító)
  // Rendezés: legújabb legyen elöl
  const books = await Book.find({ owner: req.user.sub })
                          .sort({ createdAt: -1 });

  // Visszaküldjük JSON-ként
  res.json(books);
});

// POST /books
// Új könyv létrehozása
router.post("/", auth, async (req, res) => {
  // Kérés validálása a megadott séma alapján
  const parsed = bookCreateSchema.safeParse(req.body);

  // Ha nem valid → 400 Bad Request + hibák listája
  if (!parsed.success) {
    return res.status(400).json({ 
      message: "Validation error", 
      issues: parsed.error.issues 
    });
  }

  try {
    // Új könyv létrehozása
    // owner automatikusan a bejelentkezett user lesz
    const created = await Book.create({ 
      ...parsed.data, 
      owner: req.user.sub 
    });

    // Sikeres létrehozás → 201 Created
    return res.status(201).json(created);

  } catch (e) {
    // MongoDB unique index hiba (pl. ugyanaz az ISBN már létezik ennél a usernél)
    if (e && e.code === 11000) {
      return res.status(409).json({ 
        message: "Book with this ISBN already exists (for this user)" 
      });
    }

    // Egyéb szerverhiba
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /books/:id
// Könyv törlése ID alapján
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params; // könyv ID az URL-ből

  // Csak akkor töröljük, ha a könyv a bejelentkezett userhez tartozik
  const deleted = await Book.findOneAndDelete({ 
    _id: id, 
    owner: req.user.sub 
  });

  // Ha nincs ilyen könyv → 404 Not Found
  if (!deleted) 
    return res.status(404).json({ message: "Book not found" });

  // Sikeres törlés
  return res.json({ ok: true });
});

// Router exportálása
module.exports = router;