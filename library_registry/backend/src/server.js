//Fő szerver létrehozása

// Környezeti változók betöltése (.env fájlból)
require("dotenv").config();
const express = require("express"); // Express szerver
const cors = require("cors"); // CORS kezelés (frontend → backend kommunikáció)
const { connectDB } = require("./db"); // Adatbázis csatlakozás

// Route-ok importálása
const authRoutes = require("./routes/auth"); // autentikációs route-ok
const bookRoutes = require("./routes/books"); // könyv kezelő route-ok

const app = express(); // Express alkalmazás létrehozása

// Middleware-ek
app.use(cors()); // engedélyezi a cross-origin kéréseket
app.use(express.json()); // JSON body parsing (req.body használatához)

// Egyszerű health check endpoint
app.get("/health", (req, res) => res.json({ ok: true }));

// Route-ok regisztrálása
app.use("/auth", authRoutes); // /auth/... végpontok
app.use("/books", bookRoutes); // /books/... végpontok

// Port beállítása (env-ből vagy alapértelmezett 3000)
const port = process.env.PORT || 3000;

// Adatbázis csatlakozás, majd szerver indítás
connectDB(process.env.MONGO_URI)
  .then(() => 
    app.listen(port, () => 
      console.log(`API on http://localhost:${port}`)
    )
  )
  .catch((err) => {
    // Ha nem sikerül csatlakozni → hiba kiírás + kilépés
    console.error(err);
    process.exit(1);
  });