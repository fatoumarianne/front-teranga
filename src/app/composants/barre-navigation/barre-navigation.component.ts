import { Component, inject, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

import { AuthService } from '../../core/services/auth.service'
import { NotificationService } from '../../core/services/notification.service'

@Component({
  selector: 'app-barre-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './barre-navigation.component.html',
  styleUrl: './barre-navigation.component.css',
})
export class BarreNavigationComponent {
  private notificationService = inject(NotificationService)

  auth = inject(AuthService)

  /** compteur alimente par le service, affiche dans la pastille */
  nonLues = this.notificationService.nonLues

  /**
   * Ouverture du menu sur petit ecran.
   *
   * Bootstrap gere normalement ce repliage avec son propre JavaScript, que
   * l'application ne charge pas : on le pilote donc avec un signal, ce qui
   * evite une dependance supplementaire et permet de refermer le menu des
   * qu'un lien est choisi.
   */
  menuOuvert = signal(false)

  basculerMenu() {
    this.menuOuvert.update(ouvert => !ouvert)
  }

  fermerMenu() {
    this.menuOuvert.set(false)
  }

  constructor() {
    if (this.auth.estConnecte()) {
      this.notificationService.rafraichirCompteur().subscribe({
        error: () => {},
      })
    }
  }

  deconnexion() {
    this.auth.deconnexion()
  }
}
