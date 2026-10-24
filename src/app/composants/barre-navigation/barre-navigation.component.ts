import { Component, inject } from '@angular/core'
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
