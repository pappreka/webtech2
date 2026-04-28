// Felhasználók hitelesítéséért (autentikációért) felelős router

const express = require("express"); // Express keretrendszer
const bcrypt = require("bcrypt"); // Jelszavak hash-eléséhez és ellenőrzéséhez
const jwt = require("jsonwebtoken"); // JWT token kezeléshez
const User = require("../models/User"); // User modell importálása

const router = express.Router(); // Új router példány létrehozása

// Bejelentkezés végpont
router.post("/login", async (req, res) => {
  // Kérésből username és password kiolvasása
  const { username, password } = req.body || {};

  // Ha hiányzik valamelyik adat → 400 Bad Request
  if (!username || !password) 
    return res.status(400).json({ message: "Missing credentials" });

  // Felhasználó keresése adatbázisban
  const user = await User.findOne({ username });

  // Ha nincs ilyen user → 401 Unauthorized
  if (!user) 
    return res.status(401).json({ message: "Bad username or password" });

  // Jelszó ellenőrzése (hash összehasonlítás)
  const ok = await bcrypt.compare(password, user.passwordHash);

  // Ha nem egyezik → 401
  if (!ok) 
    return res.status(401).json({ message: "Bad username or password" });

  // JWT token generálása
  const token = jwt.sign(
    { 
      sub: user._id.toString(), // user azonosító
      username: user.username // felhasználónév
    },
    process.env.JWT_SECRET, // titkos kulcs
    { expiresIn: "2h" } // lejárati idő
  );

  // Sikeres válasz: token + username
  res.json({ token, username: user.username });
});

// Regisztráció végpont
router.post("/register", async (req, res) => {
  // Adatok kiolvasása
  const { username, password } = req.body || {};

  // Ha hiányzó adatok → 400
  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  // Username validáció (legalább 3 karakter)
  if (typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({ message: "Username too short (min 3)" });
  }

  // Password validáció (legalább 6 karakter)
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password too short (min 6)" });
  }

  // Ellenőrizzük, hogy létezik-e már ilyen username
  const exists = await User.findOne({ username: username.trim() });

  // Ha igen → 409 Conflict
  if (exists) 
    return res.status(409).json({ message: "Username already exists" });

  // Jelszó hash-elése (salt rounds = 10)
  const passwordHash = await bcrypt.hash(password, 10);

  // Új user létrehozása adatbázisban
  const user = await User.create({ 
    username: username.trim(), 
    passwordHash 
  });

  // Opcionális: azonnal token generálás regisztráció után
  const token = jwt.sign(
    { 
      sub: user._id.toString(), 
      username: user.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // Sikeres válasz: 201 Created + token
  return res.status(201).json({ token, username: user.username });
});

// Router exportálása
module.exports = router;