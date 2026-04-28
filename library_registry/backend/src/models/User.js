// MongoDB adatbázishoz készült séma
// User adatait írja le

const mongoose = require("mongoose"); // Mongoose importálása

// User séma definiálása
const userSchema = new mongoose.Schema(
  {
    // Felhasználónév
    username: { 
      type: String, 
      required: true, // kötelező mező
      unique: true, // egyedi (nem lehet két azonos username)
      trim: true // szóközök levágása elejéről/végéről
    },

    // Jelszó hash (soha nem a sima jelszót tároljuk!)
    passwordHash: { 
      type: String, 
      required: true // kötelező mező
    }
  },
  {
    // Automatikusan létrehozza:
    // - createdAt (létrehozás ideje)
    // - updatedAt (utolsó módosítás ideje)
    timestamps: true
  }
);

// Modell exportálása, így más fájlokban is használható
module.exports = mongoose.model("User", userSchema);