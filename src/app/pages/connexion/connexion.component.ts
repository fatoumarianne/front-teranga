import { Component, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

import { messageErreur, valeur } from '../../core/formulaire'
import { AuthService } from '../../core/services/auth.service'

@Component({
  selector: 'app-connexion',
  imports: [RouterLink],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css',
})
export class ConnexionComponent {
  private auth = inject(AuthService)
  private router = inject(Router)

  valeur = valeur

  email = signal('')
  motDePasse = signal('')

  enCours = signal(false)
  erreur = signal('')

  seConnecter() {
    if (this.enCours()) {
      return
    }

    this.erreur.set('')
    this.enCours.set(true)

    this.auth.connexion(this.email(), this.motDePasse()).subscribe({
      next: () => {
        this.enCours.set(false)
        // l'administrateur arrive sur son tableau de bord,
        // le membre sur le calendrier des disponibilites
        this.router.navigate([
          this.auth.estAdministrateur() ? '/admin/tableau-de-bord' : '/disponibilites',
        ])
      },
      error: (e) => {
        this.enCours.set(false)
        this.erreur.set(messageErreur(e, 'Identifiants incorrects.'))
      },
    })
  }
}
