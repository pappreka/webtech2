// MongoDB adatbázishoz készült séma
// Book adatait írja le

// Mongoose importálása (MongoDB ODM)
const mongoose = require("mongoose");

// Könyv (Book) séma definiálása
const bookSchema = new mongoose.Schema(
  {
    // A könyv tulajdonosának azonosítója (User kollekcióra hivatkozás)
    owner: { 
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
      ref: "User", // kapcsolat a User modellel (populate használható)
      required: true, // kötelező mező
      index: true // indexelés a gyorsabb kereséshez
    },

    // Könyv címe
    title: { 
      type: String, 
      required: true, // kötelező
      trim: true // felesleges szóközök levágása elejéről/végéről
    },

    // Szerző neve
    author: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // ISBN szám (egyedi könyvazonosító)
    isbn: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Kiadási év
    year: { 
      type: Number, 
      min: 0, // minimum érték
      max: 3000 // maximum érték (ésszerű felső korlát)
    },

    // Példányszám (hány darab van a könyvből)
    copies: { 
      type: Number, 
      required: true, 
      min: 0, // nem lehet negatív
      default: 1 // alapértelmezett érték
    }
  },
  {
    // Automatikusan létrehozza a createdAt és updatedAt mezőket
    timestamps: true
  }
);

// Összetett index: egy felhasználónak (owner) nem lehet két ugyanolyan ISBN-es könyve
bookSchema.index(
  { owner: 1, isbn: 1 }, // mezők
  { unique: true } // egyediség biztosítása
);

// Modell exportálása (Book néven lesz elérhető)
module.exports = mongoose.model("Book", bookSchema);