import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { BarreNavigationComponent } from './composants/barre-navigation/barre-navigation.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarreNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  titre = 'Club Sportif Teranga'
}
