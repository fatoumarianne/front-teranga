import { Component, computed, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

import { messageErreur, valeur } from '../../core/formulaire'
import { AuthService } from '../../core/services/auth.service'

@Component({
  selector: 'app-inscription',
  imports: [RouterLink],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css',
})
export class InscriptionComponent {
  private auth = inject(AuthService)
  private router = inject(Router)

  valeur = valeur

  nom = signal('')
  prenom = signal('')
  email = signal('')
  telephone = signal('')
  motDePasse = signal('')
  confirmation = signal('')

  enCours = signal(false)
  erreur = signal('')

  /**
   * Validation cote client, recalculee a chaque frappe.
   * Elle ne remplace pas la validation du serveur : elle evite seulement
   * un aller-retour inutile et guide l'utilisateur pendant la saisie.
   */
  motDePasseTropCourt = computed(
    () => this.motDePasse().length > 0 && this.motDePasse().length < 8)

  confirmationDifferente = computed(
    () => this.confirmation().length > 0 && this.confirmation() !== this.motDePasse())

  formulaireValide = computed(() =>
    this.nom().trim() !== ''
    && this.prenom().trim() !== ''
    && this.email().trim() !== ''
    && this.motDePasse().length >= 8
    && this.confirmation() === this.motDePasse())

  sInscrire() {
    if (this.enCours() || !this.formulaireValide()) {
      return
    }

    this.erreur.set('')
    this.enCours.set(true)

    this.auth.inscription({
      nom: this.nom(),
      prenom: this.prenom(),
      email: this.email(),
      telephone: this.telephone() || undefined,
      mot_de_passe: this.motDePasse(),
      mot_de_passe_confirmation: this.confirmation(),
    }).subscribe({
      next: () => {
        this.enCours.set(false)
        this.router.navigate(['/disponibilites'])
      },
      error: (e) => {
        this.enCours.set(false)
        this.erreur.set(messageErreur(e, "L'inscription a échoué."))
      },
    })
  }
}
