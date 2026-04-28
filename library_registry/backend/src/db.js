//Adatbázis kapcsolat felépítése

// Mongoose importálása (MongoDB ODM)
const mongoose = require("mongoose");

// Adatbázis csatlakozó függvény
async function connectDB(uri) {
  // strictQuery bekapcsolása:
  // csak a sémában definiált mezőkre enged lekérdezést
  mongoose.set("strictQuery", true);
  // Kapcsolódás a MongoDB adatbázishoz a megadott URI-val
  await mongoose.connect(uri);
  // Sikeres csatlakozás esetén log üzenet
  console.log("MongoDB connected");
}

// Függvény exportálása
module.exports = { connectDB };