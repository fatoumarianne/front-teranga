import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'

import { ReservationCarteComponent } from '../../composants/reservation-carte/reservation-carte.component'
import { messageErreur } from '../../core/formulaire'
import { Reservation, StatutReservation } from '../../core/modeles'
import { ReservationService } from '../../core/services/reservation.service'

@Component({
  selector: 'app-mes-reservations',
  imports: [ReservationCarteComponent, RouterLink],
  templateUrl: './mes-reservations.component.html',
  styleUrl: './mes-reservations.component.css',
})
export class MesReservationsComponent {
  private reservationService = inject(ReservationService)

  reservations = signal<Reservation[]>([])
  filtre = signal<StatutReservation | 'toutes'>('toutes')

  chargement = signal(true)
  erreur = signal('')
  message = signal('')

  /** Liste filtree, recalculee des que le filtre ou la liste changent. */
  visibles = computed(() => {
    const f = this.filtre()
    const toutes = this.reservations()
    return f === 'toutes' ? toutes : toutes.filter(r => r.statut === f)
  })

  compteur = computed(() => {
    const toutes = this.reservations()
    return {
      toutes: toutes.length,
      en_attente: toutes.filter(r => r.statut === 'en_attente').length,
      validee: toutes.filter(r => r.statut === 'validee').length,
    }
  })

  constructor() {
    this.charger()
  }

  changerFiltre(f: StatutReservation | 'toutes') {
    this.filtre.set(f)
  }

  annuler(id: number) {
    if (!confirm('Confirmer l\'annulation de cette réservation ?')) {
      return
    }

    this.message.set('')
    this.erreur.set('')

    this.reservationService.annuler(id).subscribe({
      next: (reponse) => {
        this.message.set(reponse.message)
        this.charger()
      },
      error: (e) => this.erreur.set(messageErreur(e, "L'annulation a échoué.")),
    })
  }

  private charger() {
    this.chargement.set(true)

    this.reservationService.lister().subscribe({
      next: (liste) => {
        this.reservations.set(liste)
        this.chargement.set(false)
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set('Impossible de charger vos réservations.')
      },
    })
  }
}
