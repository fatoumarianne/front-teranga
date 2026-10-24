import { Component, inject, signal } from '@angular/core'

import { dateSeule } from '../../../core/dates'
import { messageErreur, valeur } from '../../../core/formulaire'
import { Utilisateur } from '../../../core/modeles'
import { MembreService } from '../../../core/services/membre.service'

/**
 * Gestion des comptes.
 *
 * Un compte n'est jamais supprime mais desactive : l'historique des
 * reservations qui lui sont rattachees doit rester consultable.
 */
@Component({
  selector: 'app-membres',
  templateUrl: './membres.component.html',
  styleUrl: './membres.component.css',
})
export class MembresComponent {
  private membreService = inject(MembreService)

  valeur = valeur
  dateSeule = dateSeule

  membres = signal<Utilisateur[]>([])
  recherche = signal('')

  chargement = signal(true)
  erreur = signal('')
  message = signal('')

  constructor() {
    this.charger()
  }

  rechercher(terme: string) {
    this.recherche.set(terme)
    this.charger()
  }

  basculerStatut(m: Utilisateur) {
    const action = m.statut === 'actif' ? 'désactiver' : 'activer'
    if (!confirm(`Voulez-vous ${action} le compte de ${m.nom_complet} ?`)) {
      return
    }

    this.message.set('')
    this.erreur.set('')

    this.membreService.basculerStatut(m.id).subscribe({
      next: (reponse) => {
        this.message.set(reponse.message)
        this.charger()
      },
      error: (e) => this.erreur.set(messageErreur(e, "L'opération a échoué.")),
    })
  }

  private charger() {
    this.chargement.set(true)

    this.membreService.lister(this.recherche()).subscribe({
      next: (liste) => {
        this.membres.set(liste)
        this.chargement.set(false)
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set('Impossible de charger les comptes.')
      },
    })
  }
}
