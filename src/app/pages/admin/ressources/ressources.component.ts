import { Component, computed, inject, signal } from '@angular/core'

import { messageErreur, valeur } from '../../../core/formulaire'
import { Ressource, TypeRessource } from '../../../core/modeles'
import { RessourceService } from '../../../core/services/ressource.service'

/** Gestion des salles et des equipements : creation, modification, suppression. */
@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrl: './ressources.component.css',
})
export class RessourcesComponent {
  private ressourceService = inject(RessourceService)

  valeur = valeur

  ressources = signal<Ressource[]>([])
  chargement = signal(true)
  erreur = signal('')
  message = signal('')

  /** null = formulaire ferme, 0 = creation, >0 = modification */
  edition = signal<number | null>(null)

  fType = signal<TypeRessource>('salle')
  fNom = signal('')
  fDescription = signal('')
  fDisponible = signal(true)
  fCapacite = signal('')
  fQuantite = signal('')
  fEtat = signal('')

  salles = computed(() => this.ressources().filter(r => r.type === 'salle'))
  equipements = computed(() => this.ressources().filter(r => r.type === 'equipement'))

  formulaireValide = computed(() => this.fNom().trim() !== '')

  constructor() {
    this.charger()
  }

  ouvrirCreation() {
    this.edition.set(0)
    this.fType.set('salle')
    this.fNom.set('')
    this.fDescription.set('')
    this.fDisponible.set(true)
    this.fCapacite.set('')
    this.fQuantite.set('')
    this.fEtat.set('')
  }

  ouvrirModification(r: Ressource) {
    this.edition.set(r.id)
    this.fType.set(r.type)
    this.fNom.set(r.nom)
    this.fDescription.set(r.description ?? '')
    this.fDisponible.set(r.disponible)
    this.fCapacite.set(r.capacite != null ? String(r.capacite) : '')
    this.fQuantite.set(r.quantite != null ? String(r.quantite) : '')
    this.fEtat.set(r.etat ?? '')
  }

  fermer() {
    this.edition.set(null)
  }

  enregistrer() {
    if (!this.formulaireValide()) {
      return
    }

    const donnees: Partial<Ressource> = {
      type: this.fType(),
      nom: this.fNom().trim(),
      description: this.fDescription().trim() || null,
      disponible: this.fDisponible(),
      capacite: this.fType() === 'salle' && this.fCapacite() ? Number(this.fCapacite()) : null,
      quantite: this.fType() === 'equipement' && this.fQuantite() ? Number(this.fQuantite()) : null,
      etat: this.fType() === 'equipement' ? (this.fEtat().trim() || null) : null,
    }

    this.reinitialiserMessages()
    const id = this.edition()

    const requete = id && id > 0
      ? this.ressourceService.modifier(id, donnees)
      : this.ressourceService.creer(donnees)

    requete.subscribe({
      next: (reponse) => {
        this.message.set(reponse.message)
        this.fermer()
        this.charger()
      },
      error: (e) => this.erreur.set(messageErreur(e, "L'enregistrement a échoué.")),
    })
  }

  supprimer(r: Ressource) {
    if (!confirm(`Supprimer « ${r.nom} » ?`)) {
      return
    }

    this.reinitialiserMessages()

    this.ressourceService.supprimer(r.id).subscribe({
      next: (reponse) => {
        this.message.set(reponse.message)
        this.charger()
      },
      // le serveur refuse la suppression si des reservations existent
      error: (e) => this.erreur.set(messageErreur(e, 'La suppression a échoué.')),
    })
  }

  private reinitialiserMessages() {
    this.message.set('')
    this.erreur.set('')
  }

  private charger() {
    this.chargement.set(true)

    this.ressourceService.lister().subscribe({
      next: (liste) => {
        this.ressources.set(liste)
        this.chargement.set(false)
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set('Impossible de charger les ressources.')
      },
    })
  }
}
