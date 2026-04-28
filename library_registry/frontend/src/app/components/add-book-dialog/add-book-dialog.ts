// Űrlap megjelenítés könyv felvitelére (Angular + Material Dialog)

import { Component } from '@angular/core'; // Angular komponens
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'; // reaktív űrlapok
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // dialog kezelés
import { MatFormFieldModule } from '@angular/material/form-field'; // Material form field
import { MatInputModule } from '@angular/material/input'; // input mezők
import { MatButtonModule } from '@angular/material/button'; // gombok
import { isbnValidator } from '../../validators/isbn.validator'; // egyedi ISBN validátor

//Komponens definiálás
@Component({
  selector: 'app-add-book-dialog', // komponens selector
  standalone: true, // standalone komponens (nem kell module-ba regisztrálni)
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-book-dialog.html', // HTML template
})
//Űrlap felépítés
export class AddBookDialogComponent {

  // Űrlap objektum
  form;

  constructor(
    private fb: FormBuilder, // FormBuilder injektálása
    private ref: MatDialogRef<AddBookDialogComponent> // dialog referencia (bezáráshoz)
  ) {
    // Űrlap inicializálása
    this.form = this.fb.group({
      // Könyv címe (kötelező)
      title: ['', [Validators.required]],
      // Szerző neve (kötelező)
      author: ['', [Validators.required]],
      // ISBN mező (kötelező + egyedi validator)
      isbn: ['', [Validators.required, isbnValidator]],
      // Kiadási év (nem kötelező)
      year: [null as number | null],
      // Példányszám (alapértelmezett: 1, nem lehet negatív)
      copies: [1, [Validators.required, Validators.min(0)]],
    });
  }

  // Mentés gomb kezelése
 save() {
  console.log('SAVE CLICKED');
  console.log('valid:', this.form.valid);
  console.log('value:', this.form.getRawValue());
  console.log('errors:', this.form.errors);
  console.log('isbn errors:', this.form.controls.isbn.errors);

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    alert('Hibás adatok! Ellenőrizd az ISBN-t és a kötelező mezőket.');
    return;
  }

  this.ref.close(this.form.getRawValue());
}

  // Mégse gomb kezelése
  cancel() {
    // Dialog bezárása null értékkel (nem történt mentés)
    this.ref.close(null);
  }
}