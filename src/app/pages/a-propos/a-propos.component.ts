import { Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'

import { CLUB } from '../../core/club'
import { RessourceService } from '../../core/services/ressource.service'

/**
 * Page « A propos », publique.
 *
 * Elle presente le club et explique a quoi sert l'application. Les deux
 * compteurs affiches ne sont pas ecrits en dur : ils viennent des
 * ressources publiques, de sorte que la page reste juste si le club ouvre
 * une salle supplementaire.
 */
@Component({
  selector: 'app-a-propos',
  imports: [RouterLink],
  templateUrl: './a-propos.component.html',
  styleUrl: './a-propos.component.css',
})
export class AProposComponent {
  private ressourceService = inject(RessourceService)

  club = CLUB

  nombreSalles = signal(0)
  nombreEquipements = signal(0)

  /** Les valeurs du club, affichees en trois cartes. */
  valeurs = [
    {
      titre: 'La teranga',
      texte: "L'hospitalité sénégalaise donne son nom au club. On y accueille le débutant comme le joueur confirmé, sans distinction.",
    },
    {
      titre: 'L’accessibilité',
      texte: "Des cotisations à la portée des familles du quartier, et un tarif réduit pour les moins de dix-huit ans.",
    },
    {
      titre: 'Le partage',
      texte: "Les salles et le matériel appartiennent à tous les membres. Les réserver équitablement, c'est en garantir l'accès à chacun.",
    },
  ]

  /** Ce que l'application change, pour le membre et pour le club. */
  apports = [
    {
      titre: 'Réserver sans se déplacer',
      texte: "Le calendrier des créneaux libres est consultable à toute heure, depuis un téléphone.",
    },
    {
      titre: 'Plus de double réservation',
      texte: "L'application refuse d'elle-même tout créneau qui en chevauche un autre : la vérification est automatique.",
    },
    {
      titre: 'Une trace de chaque demande',
      texte: "Qui a réservé quoi, quand, et avec quelle décision : tout est conservé et consultable.",
    },
    {
      titre: 'Un club que l’on peut piloter',
      texte: "Le secrétariat suit l'occupation des salles et l'évolution des réservations sur un tableau de bord.",
    },
  ]

  constructor() {
    this.ressourceService.publiques().subscribe({
      next: liste => {
        this.nombreSalles.set(liste.filter(r => r.type === 'salle').length)
        this.nombreEquipements.set(liste.filter(r => r.type !== 'salle').length)
      },
      error: () => {},
    })
  }
}
