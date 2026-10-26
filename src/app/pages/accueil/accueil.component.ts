import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'

import { illustrationRessource } from '../../core/illustration'
import { Ressource } from '../../core/modeles'
import { AuthService } from '../../core/services/auth.service'
import { RessourceService } from '../../core/services/ressource.service'

/**
 * Page d'accueil publique.
 *
 * C'est la premiere page que voit un visiteur, avant toute connexion : elle
 * presente le club, les salles et equipements disponibles, et le
 * fonctionnement de la reservation. Les ressources proviennent d'une route
 * d'API ouverte, qui ne renvoie que ce qui est disponible.
 */
@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent {
  private ressourceService = inject(RessourceService)

  auth = inject(AuthService)

  ressources = signal<Ressource[]>([])
  chargement = signal(true)
  erreur = signal('')

  salles = computed(() => this.ressources().filter(r => r.type === 'salle'))
  equipements = computed(() => this.ressources().filter(r => r.type === 'equipement'))

  constructor() {
    this.ressourceService.publiques().subscribe({
      next: (liste) => {
        this.ressources.set(liste)
        this.chargement.set(false)
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set("Les ressources du club n'ont pas pu être chargées.")
      },
    })
  }

  /** Vignette de la ressource (photo ou illustration par defaut). */
  illustration = illustrationRessource
}
