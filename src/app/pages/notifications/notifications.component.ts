import { Component, inject, signal } from '@angular/core'

import { dateHeure } from '../../core/dates'
import { Notification } from '../../core/modeles'
import { NotificationService } from '../../core/services/notification.service'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService)

  dateHeure = dateHeure

  notifications = signal<Notification[]>([])
  chargement = signal(true)
  erreur = signal('')

  constructor() {
    this.charger()
  }

  marquerLue(n: Notification) {
    if (n.lu) {
      return
    }

    this.notificationService.marquerLue(n.id).subscribe({
      next: () => this.notifications.update(
        liste => liste.map(x => (x.id === n.id ? { ...x, lu: true } : x))),
      error: () => this.erreur.set("La notification n'a pas pu être marquée comme lue."),
    })
  }

  toutMarquerLues() {
    this.notificationService.toutMarquerLues().subscribe({
      next: () => this.notifications.update(
        liste => liste.map(x => ({ ...x, lu: true }))),
      error: () => this.erreur.set('Opération impossible.'),
    })
  }

  private charger() {
    this.notificationService.lister().subscribe({
      next: (liste) => {
        this.notifications.set(liste)
        this.chargement.set(false)
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set('Impossible de charger les notifications.')
      },
    })
  }
}
