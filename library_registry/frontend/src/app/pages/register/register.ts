// Regisztrációs képernyő vezérlése (Angular komponens)

import { Component } from '@angular/core'; // Angular komponens
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'; // reaktív űrlapok
import { Router } from '@angular/router'; // navigáció
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // értesítések
import { MatToolbarModule } from '@angular/material/toolbar'; // toolbar
import { MatCardModule } from '@angular/material/card'; // kártya
import { MatFormFieldModule } from '@angular/material/form-field'; // form mezők
import { MatInputModule } from '@angular/material/input'; // input mezők
import { MatButtonModule } from '@angular/material/button'; // gombok

import { AuthService } from '../../services/auth'; // autentikációs service

//Komponens definiálás
@Component({
  selector: 'app-register', // komponens neve
  standalone: true, // standalone komponens
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.html', // HTML template
  styleUrl: './register.scss', // stílus
})
//Űrlap felépítés
export class Register {

  // Betöltési állapot
  loading = false;
  // Űrlap objektum
  form;

  constructor(
    private fb: FormBuilder, // FormBuilder
    private auth: AuthService, // auth service
    private router: Router, // navigáció
    private snack: MatSnackBar // értesítések
  ) {
    // Űrlap inicializálása validációval
    this.form = this.fb.group({
      // Username: kötelező + min 3 karakter
      username: ['', [Validators.required, Validators.minLength(3)]],
      // Password: kötelező + min 6 karakter
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Regisztráció kezelése
  submit() {

    // Ha hibás az űrlap vagy már fut kérés → kilép
    if (this.form.invalid || this.loading) return;

    // Adatok kinyerése
    const { username, password } = this.form.value;
    // Betöltési állapot bekapcsolása
    this.loading = true;

    // Backend register hívás
    this.auth.register(username!, password!).subscribe({
      next: () => {
        this.loading = false;
        // Sikeres regisztráció után navigáció
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.loading = false;
        // Hibakezelés
        if (err?.status === 409) {
          // Username már foglalt
          this.snack.open('Ez a felhasználónév már foglalt', 'OK', { duration: 2500 });
        } else {
          // Egyéb hiba
          this.snack.open('Regisztráció sikertelen', 'OK', { duration: 2500 });
        }
      },
    });
  }

  // Navigáció a login oldalra
  goLogin() {
    this.router.navigate(['/login']);
  }
}