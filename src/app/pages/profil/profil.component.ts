import { Component, computed, inject, signal } from '@angular/core'

import { dateSeule } from '../../core/dates'
import { messageErreur, valeur } from '../../core/formulaire'
import { AuthService } from '../../core/services/auth.service'

/**
 * Ecran « Mon profil ».
 *
 * Deux formulaires independants sur la meme page : les informations
 * personnelles d'un cote, le mot de passe de l'autre. Les separer evite
 * d'obliger l'utilisateur a ressaisir son mot de passe pour corriger un
 * numero de telephone.
 */
@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent {
  private auth = inject(AuthService)

  valeur = valeur
  dateSeule = dateSeule

  utilisateur = this.auth.utilisateur

  // --------------------------------------------- informations personnelles

  nom = signal(this.utilisateur()?.nom ?? '')
  prenom = signal(this.utilisateur()?.prenom ?? '')
  email = signal(this.utilisateur()?.email ?? '')
  telephone = signal(this.utilisateur()?.telephone ?? '')

  enregistrementEnCours = signal(false)
  erreurInfos = signal('')
  succesInfos = signal('')

  infosValides = computed(() =>
    this.nom().trim() !== ''
    && this.prenom().trim() !== ''
    && this.email().trim() !== '')

  // ------------------------------------------------------- mot de passe

  motDePasseActuel = signal('')
  nouveauMotDePasse = signal('')
  confirmation = signal('')

  changementEnCours = signal(false)
  erreurMotDePasse = signal('')
  succesMotDePasse = signal('')

  motDePasseTropCourt = computed(
    () => this.nouveauMotDePasse().length > 0 && this.nouveauMotDePasse().length < 8)

  confirmationDifferente = computed(
    () => this.confirmation().length > 0
      && this.confirmation() !== this.nouveauMotDePasse())

  motDePasseValide = computed(() =>
    this.motDePasseActuel() !== ''
    && this.nouveauMotDePasse().length >= 8
    && this.confirmation() === this.nouveauMotDePasse())

  constructor() {
    // Les champs sont pre-remplis avec la copie locale de l'utilisateur, puis
    // rafraichis depuis le serveur : si le compte a ete modifie ailleurs
    // (par un administrateur, par exemple), la page affiche l'etat reel.
    this.auth.profil().subscribe({
      next: (reponse) => {
        this.nom.set(reponse.data.nom)
        this.prenom.set(reponse.data.prenom)
        this.email.set(reponse.data.email)
        this.telephone.set(reponse.data.telephone ?? '')
      },
      error: () => {},
    })
  }

  // ------------------------------------------------------------- actions

  enregistrerInfos() {
    if (this.enregistrementEnCours() || !this.infosValides()) {
      return
    }

    this.erreurInfos.set('')
    this.succesInfos.set('')
    this.enregistrementEnCours.set(true)

    this.auth.majProfil({
      nom: this.nom(),
      prenom: this.prenom(),
      email: this.email(),
      telephone: this.telephone() || null,
    }).subscribe({
      next: () => {
        this.enregistrementEnCours.set(false)
        this.succesInfos.set('Vos informations ont été enregistrées.')
      },
      error: (e) => {
        this.enregistrementEnCours.set(false)
        this.erreurInfos.set(messageErreur(e, "L'enregistrement a échoué."))
      },
    })
  }

  changerMotDePasse() {
    if (this.changementEnCours() || !this.motDePasseValide()) {
      return
    }

    this.erreurMotDePasse.set('')
    this.succesMotDePasse.set('')
    this.changementEnCours.set(true)

    this.auth.majProfil({
      mot_de_passe_actuel: this.motDePasseActuel(),
      mot_de_passe: this.nouveauMotDePasse(),
      mot_de_passe_confirmation: this.confirmation(),
    }).subscribe({
      next: () => {
        this.changementEnCours.set(false)
        this.succesMotDePasse.set('Votre mot de passe a été modifié.')
        this.motDePasseActuel.set('')
        this.nouveauMotDePasse.set('')
        this.confirmation.set('')
      },
      error: (e) => {
        this.changementEnCours.set(false)
        this.erreurMotDePasse.set(messageErreur(e, 'La modification a échoué.'))
      },
    })
  }
}
