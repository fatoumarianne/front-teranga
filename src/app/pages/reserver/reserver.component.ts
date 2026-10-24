import { Component, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'

import { messageErreur, valeur } from '../../core/formulaire'
import { Ressource } from '../../core/modeles'
import { ReservationService } from '../../core/services/reservation.service'
import { RessourceService } from '../../core/services/ressource.service'

/**
 * Formulaire de demande de reservation.
 *
 * Le conflit de creneau est verifie par le serveur, qui repond 409 si la
 * ressource est deja prise. On affiche alors son message tel quel, car il
 * explique precisement ce qui bloque.
 */
@Component({
  selector: 'app-reserver',
  templateUrl: './reserver.component.html',
  styleUrl: './reserver.component.css',
})
export class ReserverComponent {
  private ressourceService = inject(RessourceService)
  private reservationService = inject(ReservationService)
  private router = inject(Router)

  valeur = valeur

  ressources = signal<Ressource[]>([])
  idRessource = signal<number | null>(null)
  dateDebut = signal('')
  dateFin = signal('')

  enCours = signal(false)
  erreur = signal('')
  succes = signal('')

  ressourceChoisie = computed(
    () => this.ressources().find(r => r.id === this.idRessource()) ?? null)

  formulaireValide = computed(() =>
    this.idRessource() !== null
    && this.dateDebut() !== ''
    && this.dateFin() !== ''
    && this.dateFin() > this.dateDebut())

  finAvantDebut = computed(
    () => this.dateDebut() !== '' && this.dateFin() !== '' && this.dateFin() <= this.dateDebut())

  constructor() {
    this.ressourceService.lister({ disponible: true }).subscribe({
      next: (liste) => this.ressources.set(liste),
      error: () => this.erreur.set('Impossible de charger les ressources.'),
    })
  }

  choisirRessource(v: string) {
    this.idRessource.set(v ? Number(v) : null)
  }

  envoyer() {
    if (this.enCours() || !this.formulaireValide()) {
      return
    }

    this.erreur.set('')
    this.succes.set('')
    this.enCours.set(true)

    this.reservationService.creer({
      id_ressource: this.idRessource()!,
      date_debut: this.dateDebut().replace('T', ' ') + ':00',
      date_fin: this.dateFin().replace('T', ' ') + ':00',
    }).subscribe({
      next: (reponse) => {
        this.enCours.set(false)
        this.succes.set(reponse.message)
        // on laisse le message visible un instant avant de rediriger
        setTimeout(() => this.router.navigate(['/mes-reservations']), 1200)
      },
      error: (e) => {
        this.enCours.set(false)
        this.erreur.set(messageErreur(e, "La demande n'a pas pu être enregistrée."))
      },
    })
  }
}
