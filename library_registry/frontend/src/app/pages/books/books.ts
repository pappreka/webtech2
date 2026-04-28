// Összekötési pont (frontend UI és backend API között)

import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Angular core
import { CommonModule } from '@angular/common'; // alap modul
import { Router } from '@angular/router'; // navigáció

// Angular Material modulok
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Saját service-ek és komponensek
import { BooksService, Book } from '../../services/books';
import { AuthService } from '../../services/auth';
import { AddBookDialogComponent } from '../../components/add-book-dialog/add-book-dialog';

//Komponens definiálás
@Component({
  selector: 'app-books', // komponens neve
  standalone: true, // standalone komponens
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './books.html', // HTML template
  styleUrl: './books.scss', // stílus
})
//Űrlap felépítés
export class Books implements OnInit {

  // Táblázat oszlopai
  displayedColumns = ['title', 'author', 'isbn', 'year', 'copies', 'actions'];
  // Könyvek listája
  books: Book[] = [];
  // Betöltési állapot
  loading = false;

  constructor(
    private booksApi: BooksService, // backend API hívások
    private dialog: MatDialog, // dialog kezelés
    private snack: MatSnackBar, // értesítések
    private auth: AuthService, // auth kezelés
    private router: Router, // navigáció
    private cdr: ChangeDetectorRef // manuális change detection
  ) {}

  // Komponens inicializálásakor lefut
  ngOnInit(): void {
    this.reload();
  }

  // Könyvek újratöltése backendről
  reload() {
    this.loading = true;

    this.booksApi.list().subscribe({
      next: (data) => {
        this.books = data; // adatok beállítása
        this.loading = false;
        this.cdr.detectChanges(); // UI frissítése
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        // Hibaüzenet
        this.snack.open('Nem sikerült betölteni a könyveket', 'OK', { duration: 2500 });
      },
    });
  }

  // Új könyv hozzáadása
  add() {
    // Dialog megnyitása
    const ref = this.dialog.open(AddBookDialogComponent, { width: '520px' });

    // Dialog bezárás után
    ref.afterClosed().subscribe((val) => {

      // Ha nincs adat → kilépés
      if (!val) return;

      // Backend hívás
      this.booksApi.create(val).subscribe({
        next: () => {
          this.snack.open('Könyv hozzáadva', 'OK', { duration: 2000 });
          this.reload(); // lista frissítése
        },
        error: (err) => {
          // Hibakezelés státuszkód alapján
          if (err?.status === 409) {
            this.snack.open('Már létezik könyv ezzel az ISBN-nel', 'OK', { duration: 2500 });
          } else if (err?.status === 400) {
            this.snack.open('Hibás adatok (validáció)', 'OK', { duration: 2500 });
          } else if (err?.status === 401) {
            this.snack.open('Lejárt a belépés, lépj be újra', 'OK', { duration: 2500 });
            this.logout(); // automatikus kijelentkeztetés
          } else {
            this.snack.open('Hiba a mentésnél', 'OK', { duration: 2500 });
          }
        },
      });
    });
  }

  // Könyv törlése
  remove(book: Book) {

    // Ha nincs ID → nem törölhető
    if (!book._id) return;

    // Felhasználói megerősítés
    const ok = confirm(`Biztos törlöd?\n\n${book.title} (${book.isbn})`);
    if (!ok) return;

    // Backend törlés hívás
    this.booksApi.delete(book._id).subscribe({
      next: () => {
        this.snack.open('Könyv törölve', 'OK', { duration: 2000 });
        this.reload(); // lista frissítése
      },
      error: () => {
        this.snack.open('Nem sikerült törölni', 'OK', { duration: 2500 });
      },
    });
  }

  // Kijelentkezés
  logout() {
    this.auth.logout(); // token törlése
    this.router.navigate(['/login']); // átirányítás login oldalra
  }
}