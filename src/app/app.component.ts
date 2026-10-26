import { Component } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

import { BarreNavigationComponent } from './composants/barre-navigation/barre-navigation.component'
import {
  CLUB,
  HORAIRES,
  MOYENS_PAIEMENT,
  lienCarte,
  lienTelephone,
  lienWhatsapp,
} from './core/club'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, BarreNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  titre = 'Club Sportif Teranga'

  /** coordonnees reprises du fichier partage avec la page de contact */
  club = CLUB
  horaires = HORAIRES
  moyensPaiement = MOYENS_PAIEMENT

  lienTelephone = lienTelephone()
  lienCarte = lienCarte()
  lienWhatsapp = lienWhatsapp()

  /** annee courante, pour la mention de copyright */
  annee = new Date().getFullYear()
}
