// Gyökérkomponens (root component)
// Ez az Angular alkalmazás belépési pontja

import { Component } from '@angular/core'; // Angular komponens
import { RouterOutlet } from '@angular/router'; // router nézet helye

@Component({
  selector: 'app-root', // HTML-ben <app-root> néven használható
  standalone: true, // standalone komponens (nem kell NgModule)
  imports: [RouterOutlet], // router outlet importálása
  template: `<router-outlet />`, // ide töltődnek be a route-ok komponensei
})
export class App {}