// Konfigurációs központ a fejlesztési környezethez (environment fájl)
// Ez a fájl tartalmazza az alkalmazás környezeti beállításait

export const environment = {
  // Meghatározza, hogy production módban fut-e az app
  // false → fejlesztői környezet
  production: false,
  // Backend API címe
  // Ide küldi a frontend a HTTP kéréseket
  apiUrl: 'http://localhost:3000',
};