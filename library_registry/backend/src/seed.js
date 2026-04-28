// Admin felhasználó létrehozása (seed script)

// Környezeti változók betöltése (.env fájlból)
require("dotenv").config();
const bcrypt = require("bcrypt"); // Jelszó hash-eléshez
const { connectDB } = require("./db"); // Adatbázis kapcsolat
const User = require("./models/User"); // User modell

// Fő futtató függvény
async function run() {
  // Kapcsolódás a MongoDB adatbázishoz
  await connectDB(process.env.MONGO_URI);
  // Alapértelmezett admin adatok
  const username = "admin";
  const password = "admin123";
  // Ellenőrizzük, hogy létezik-e már az admin user
  const exists = await User.findOne({ username });

  if (exists) {
    console.log("Admin already exists");
    process.exit(0); // Kilépés sikeresen
  }

  // Jelszó hash-elése (salt rounds = 10)
  const passwordHash = await bcrypt.hash(password, 10);
  // Új admin user létrehozása
  await User.create({ username, passwordHash });
  // Kiírjuk az eredményt
  console.log("Seeded admin:", { username, password });
  // Sikeres lefutás után kilépés
  process.exit(0);
}

// A script futtatása hibakezeléssel
run().catch((e) => {
  console.error(e); // hiba kiírása
  process.exit(1); // hibás kilépés
});