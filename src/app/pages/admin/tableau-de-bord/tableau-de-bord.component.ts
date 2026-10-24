import { Component, ElementRef, OnDestroy, effect, inject, signal, viewChild } from '@angular/core'
import { Chart, registerables } from 'chart.js'
import { RouterLink } from '@angular/router'

import { libelleStatut } from '../../../core/dates'
import { Statistiques } from '../../../core/modeles'
import { StatistiqueService } from '../../../core/services/statistique.service'

Chart.register(...registerables)

/**
 * Tableau de bord de l'administrateur.
 *
 * Les compteurs et les deux graphiques sont alimentes par une seule requete
 * vers /api/statistiques : c'est le serveur qui agrege, pour eviter de faire
 * descendre toutes les reservations jusqu'au navigateur.
 */
@Component({
  selector: 'app-tableau-de-bord',
  imports: [RouterLink],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.css',
})
export class TableauDeBordComponent implements OnDestroy {
  private statistiqueService = inject(StatistiqueService)

  // requetes optionnelles : les canvas sont dans un bloc @if, ils n'existent
  // donc pas tant que les statistiques ne sont pas arrivees
  private canvasRessources = viewChild<ElementRef<HTMLCanvasElement>>('graphRessources')
  private canvasMois = viewChild<ElementRef<HTMLCanvasElement>>('graphMois')

  private graphiques: Chart[] = []

  libelleStatut = libelleStatut

  stats = signal<Statistiques | null>(null)
  chargement = signal(true)
  erreur = signal('')

  /** { statut: nombre } transforme en liste, pour l'afficher avec @for */
  statuts = signal<{ cle: string; valeur: number }[]>([])

  constructor() {
    this.statistiqueService.tableauDeBord().subscribe({
      next: (s) => {
        this.stats.set(s)
        this.statuts.set(
          Object.entries(s.par_statut).map(([cle, valeur]) => ({ cle, valeur })))
        this.chargement.set(false)
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set('Impossible de charger les statistiques.')
      },
    })

    /*
     * On ne peut pas dessiner dès la réception des données : les <canvas>
     * sont dans un bloc @if et n'existent pas encore à cet instant.
     *
     * Cet effect lit trois signals — les statistiques et les deux requêtes
     * de vue. Il se relance donc tout seul dès que les trois sont
     * disponibles, c'est-à-dire une fois les canvas réellement créés par
     * Angular. C'est exactement ce à quoi sert effect() : réagir au moment
     * où des valeurs réactives changent, sans avoir à deviner le bon
     * instant dans le cycle de vie du composant.
     */
    effect(() => {
      const s = this.stats()
      const c1 = this.canvasRessources()
      const c2 = this.canvasMois()

      if (!s || !c1 || !c2 || this.graphiques.length > 0) {
        return
      }

      this.dessiner(s, c1.nativeElement, c2.nativeElement)
    })
  }

  ngOnDestroy() {
    for (const g of this.graphiques) {
      g.destroy()
    }
  }

  private dessiner(s: Statistiques, cRessources: HTMLCanvasElement, cMois: HTMLCanvasElement) {
    const parRessource = Object.entries(s.par_ressource)
    const parMois = Object.entries(s.par_mois)

    this.graphiques.push(new Chart(cRessources, {
      type: 'bar',
      data: {
        labels: parRessource.map(([nom]) => nom),
        datasets: [{
          label: 'Réservations',
          data: parRessource.map(([, total]) => total),
          backgroundColor: '#4472c4',
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    }))

    this.graphiques.push(new Chart(cMois, {
      type: 'line',
      data: {
        labels: parMois.map(([mois]) => mois),
        datasets: [{
          label: 'Réservations par mois',
          data: parMois.map(([, total]) => total),
          borderColor: '#1f4e79',
          backgroundColor: 'rgba(68, 114, 196, 0.15)',
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    }))
  }
}
