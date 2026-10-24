import { Component, computed, inject, signal } from '@angular/core'

import { creneau, dateHeure, libelleStatut } from '../../../core/dates'
import { messageErreur, valeur } from '../../../core/formulaire'
import { Reservation, StatutReservation } from '../../../core/modeles'
import { ReservationService } from '../../../core/services/reservation.service'

/**
 * Traitement des demandes de reservation par l'administrateur.
 *
 * Le refus exige un motif : c'est lui qui sera transmis au membre dans sa
 * notification, pour qu'il comprenne la decision.
 */
@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  styleUrl: './demandes.component.css',
})
export class DemandesComponent {
  private reservationService = inject(ReservationService)

  valeur = valeur
  creneau = creneau
  dateHeure = dateHeure
  libelleStatut = libelleStatut

  reservations = signal<Reservation[]>([])
  filtre = signal<StatutReservation | 'toutes'>('en_attente')

  chargement = signal(true)
  erreur = signal('')
  message = signal('')

  /** reservation en cours de refus, et motif saisi */
  refusEnCours = signal<number | null>(null)
  motif = signal('')

  visibles = computed(() => {
    const f = this.filtre()
    const toutes = this.reservations()
    return f === 'toutes' ? toutes : toutes.filter(r => r.statut === f)
  })

  nbEnAttente = computed(
    () => this.reservations().filter(r => r.statut === 'en_attente').length)

  constructor() {
    this.charger()
  }

  changerFiltre(f: StatutReservation | 'toutes') {
    this.filtre.set(f)
  }

  valider(id: number) {
    this.reinitialiserMessages()

    this.reservationService.valider(id).subscribe({
      next: (reponse) => {
        this.message.set(reponse.message)
        this.charger()
      },
      error: (e) => this.erreur.set(messageErreur(e, 'La validation a échoué.')),
    })
  }

  ouvrirRefus(id: number) {
    this.refusEnCours.set(id)
    this.motif.set('')
  }

  annulerRefus() {
    this.refusEnCours.set(null)
    this.motif.set('')
  }

  confirmerRefus() {
    const id = this.refusEnCours()
    if (id === null || this.motif().trim() === '') {
      return
    }

    this.reinitialiserMessages()

    this.reservationService.refuser(id, this.motif().trim()).subscribe({
      next: (reponse) => {
        this.message.set(reponse.message)
        this.annulerRefus()
        this.charger()
      },
      error: (e) => this.erreur.set(messageErreur(e, 'Le refus a échoué.')),
    })
  }

  private reinitialiserMessages() {
    this.message.set('')
    this.erreur.set('')
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
        this.erreur.set('Impossible de charger les demandes.')
      },
    })
  }
}
