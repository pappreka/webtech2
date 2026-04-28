// Hitelesítő (autentikációs) middleware
// Feladata: JSON Web Token (JWT) ellenőrzése minden kérésnél

const jwt = require("jsonwebtoken"); // JWT kezeléshez szükséges könyvtár

function auth(req, res, next) {
  // Authorization header kiolvasása (pl.: "Bearer <token>")
  const header = req.headers.authorization || "";

  // Token kinyerése a "Bearer " prefix után
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  // Ha nincs token, akkor 401 Unauthorized válasz
  if (!token) 
    return res.status(401).json({ message: "Missing token" });

  try {
    // Token ellenőrzése a titkos kulccsal (JWT_SECRET)
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // A token tartalmát (payload) eltároljuk a request objektumban
    // Így a későbbi route-ok hozzáférnek (pl. req.user.sub, req.user.username)
    req.user = payload;

    // Továbbengedjük a kérést a következő middleware/route felé
    next();
  } catch {
    // Ha a token hibás / lejárt / érvénytelen → 401
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware exportálása, hogy más fájlokban is használható legyen
module.exports = { auth };