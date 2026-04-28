// Bejelentkezési képernyő vezérlése (Angular komponens)

import { Component } from '@angular/core'; // Angular komponens
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'; // reaktív űrlapok
import { Router } from '@angular/router'; // navigáció
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // értesítések
import { MatToolbarModule } from '@angular/material/toolbar'; // toolbar
import { MatCardModule } from '@angular/material/card'; // kártya
import { MatFormFieldModule } from '@angular/material/form-field'; // form mezők
import { MatInputModule } from '@angular/material/input'; // input mezők
import { MatButtonModule } from '@angular/material/button'; // gombok

import { AuthService } from '../../services/auth'; // auth service

//Komponens definiálás
@Component({
  selector: 'app-login', // komponens neve
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
  templateUrl: './login.html', // HTML template
  styleUrl: './login.scss', // stílus
})
//Űrlap felépítés
export class Login {

  // Betöltési állapot (pl. gomb tiltásához)
  loading = false;
  // Űrlap objektum
  form;

  constructor(
    private fb: FormBuilder, // FormBuilder
    private auth: AuthService, // autentikációs service
    private router: Router, // navigáció
    private snack: MatSnackBar // értesítések
  ) {
    // Űrlap inicializálása
    this.form = this.fb.group({
      username: ['', Validators.required], // kötelező
      password: ['', Validators.required], // kötelező
    });
  }

  // Bejelentkezés kezelése
  submit() {

    // Ha hibás az űrlap vagy már folyamatban van kérés → kilép
    if (this.form.invalid || this.loading) return;

    // Űrlap adatok kinyerése
    const { username, password } = this.form.value;
    // Betöltési állapot bekapcsolása
    this.loading = true;

    // Backend login hívás
    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.loading = false;
        // Sikeres login után navigáció a könyvek oldalra
        this.router.navigate(['/books']);
      },
      error: () => {
        this.loading = false;
        // Hibás login → hibaüzenet
        this.snack.open('Hibás felhasználónév vagy jelszó', 'OK', { duration: 2500 });
      },
    });
  }

  // Navigáció a regisztrációs oldalra
  goRegister() {
    this.router.navigate(['/register']);
  }
}