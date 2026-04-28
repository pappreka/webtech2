// Adatkezelés könyvekhez (BooksService)
// Feladata: kommunikáció a backend API-val könyvek esetén

import { Injectable } from '@angular/core'; // Angular service
import { HttpClient } from '@angular/common/http'; // HTTP kérésekhez
import { environment } from '../../environments/environment'; // API URL

// Book típus definíció (TypeScript interface jellegű)
export type Book = {
  _id?: string; // MongoDB azonosító (opcionális)
  title: string; // könyv címe
  author: string; // szerző
  isbn: string; // ISBN szám
  year?: number; // kiadási év (opcionális)
  copies: number; // példányszám
};

@Injectable({ providedIn: 'root' }) // globálisan elérhető service
export class BooksService {

  constructor(private http: HttpClient) {}

  // Könyvek listázása (GET /books)
  list() {
    return this.http.get<Book[]>(`${environment.apiUrl}/books`);
  }

  // Új könyv létrehozása (POST /books)
  create(book: Omit<Book, '_id'>) {
    // Omit: az _id mezőt nem küldjük, mert azt a backend generálja
    return this.http.post<Book>(`${environment.apiUrl}/books`, book);
  }

  // Könyv törlése ID alapján (DELETE /books/:id)
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/books/${id}`);
  }
}