import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal, viewChild } from '@angular/core'
import { Calendar } from '@fullcalendar/core'
import frLocale from '@fullcalendar/core/locales/fr'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

import { valeur } from '../../core/formulaire'
import { Ressource } from '../../core/modeles'
import { ReservationService } from '../../core/services/reservation.service'
import { RessourceService } from '../../core/services/ressource.service'

/**
 * Calendrier des disponibilites.
 *
 * FullCalendar est une bibliotheque JavaScript qui manipule directement le
 * DOM : on l'instancie donc dans ngAfterViewInit, une fois que l'element
 * conteneur existe reellement, et on la detruit dans ngOnDestroy pour ne pas
 * laisser d'ecouteurs d'evenements derriere soi.
 */
@Component({
  selector: 'app-disponibilites',
  templateUrl: './disponibilites.component.html',
  styleUrl: './disponibilites.component.css',
})
export class DisponibilitesComponent implements AfterViewInit, OnDestroy {
  private ressourceService = inject(RessourceService)
  private reservationService = inject(ReservationService)

  private conteneur = viewChild.required<ElementRef<HTMLDivElement>>('calendrier')
  private calendrier?: Calendar

  valeur = valeur

  ressources = signal<Ressource[]>([])
  ressourceChoisie = signal<number | null>(null)
  chargement = signal(true)
  erreur = signal('')

  ngAfterViewInit() {
    this.calendrier = new Calendar(this.conteneur().nativeElement, {
      plugins: [dayGridPlugin, timeGridPlugin],
      initialView: 'dayGridMonth',
      locale: frLocale,
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      events: [],
      eventClick: (info) => {
        const debut = info.event.start?.toLocaleString('fr-FR') ?? ''
        const fin = info.event.end?.toLocaleString('fr-FR') ?? ''
        alert(`${info.event.title}\nDu ${debut}\nau ${fin}`)
      },
    })

    this.calendrier.render()
    this.chargerRessources()
    this.chargerCreneaux()
  }

  ngOnDestroy() {
    this.calendrier?.destroy()
  }

  /** Change le filtre de ressource et recharge le calendrier. */
  filtrer(valeurChoisie: string) {
    this.ressourceChoisie.set(valeurChoisie ? Number(valeurChoisie) : null)
    this.chargerCreneaux()
  }

  private chargerRessources() {
    this.ressourceService.lister().subscribe({
      next: (liste) => this.ressources.set(liste),
      error: () => this.erreur.set('Impossible de charger la liste des ressources.'),
    })
  }

  private chargerCreneaux() {
    this.chargement.set(true)
    this.erreur.set('')

    this.reservationService.calendrier(this.ressourceChoisie() ?? undefined).subscribe({
      next: (reservations) => {
        this.chargement.set(false)

        // on remplace la totalite des evenements a chaque chargement
        this.calendrier?.removeAllEvents()
        for (const r of reservations) {
          this.calendrier?.addEvent({
            id: String(r.id),
            title: r.title ?? r.ressource?.nom ?? 'Réservation',
            start: r.start,
            end: r.end,
            color: r.color,
          })
        }
      },
      error: () => {
        this.chargement.set(false)
        this.erreur.set('Impossible de charger les créneaux occupés.')
      },
    })
  }
}
