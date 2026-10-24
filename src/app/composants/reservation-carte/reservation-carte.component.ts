import { Component, input, output } from '@angular/core'

import { creneau, dateHeure, libelleStatut } from '../../core/dates'
import { Reservation } from '../../core/modeles'

/**
 * Carte affichant une reservation.
 *
 * Composant reutilisable : il recoit la reservation par input() et signale
 * au parent une demande d'annulation par output(), sans savoir lui-meme
 * comment l'annulation est effectuee.
 */
@Component({
  selector: 'app-reservation-carte',
  templateUrl: './reservation-carte.component.html',
  styleUrl: './reservation-carte.component.css',
})
export class ReservationCarteComponent {
  reservation = input.required<Reservation>()

  /** affiche le nom du membre : utile dans la vue administrateur */
  afficherMembre = input(false)

  annule = output<number>()

  creneau = creneau
  dateHeure = dateHeure
  libelleStatut = libelleStatut

  demanderAnnulation() {
    this.annule.emit(this.reservation().id)
  }
}
