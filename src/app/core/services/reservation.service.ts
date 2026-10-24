import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs'

import { API_URL } from '../environnement'
import { Collection, Reservation, StatutReservation } from '../modeles'

/** Demandes de reservation : consultation, creation, traitement. */
@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient)

  /** Un membre recoit les siennes, l'administrateur recoit tout. */
  lister(filtres: { statut?: StatutReservation; ressource?: number } = {}) {
    let params = new HttpParams()
    if (filtres.statut) {
      params = params.set('statut', filtres.statut)
    }
    if (filtres.ressource) {
      params = params.set('ressource', String(filtres.ressource))
    }

    return this.http
      .get<Collection<Reservation>>(`${API_URL}/reservations`, { params })
      .pipe(map(r => r.data))
  }

  /** Creneaux occupes, au format attendu par FullCalendar. */
  calendrier(ressource?: number) {
    let params = new HttpParams()
    if (ressource) {
      params = params.set('ressource', String(ressource))
    }

    return this.http
      .get<Collection<Reservation>>(`${API_URL}/reservations/calendrier`, { params })
      .pipe(map(r => r.data))
  }

  creer(donnees: { id_ressource: number; date_debut: string; date_fin: string }) {
    return this.http.post<{ message: string; reservation: Reservation }>(
      `${API_URL}/reservations`, donnees)
  }

  valider(id: number) {
    return this.http.patch<{ message: string; reservation: Reservation }>(
      `${API_URL}/reservations/${id}/valider`, {})
  }

  refuser(id: number, motif: string) {
    return this.http.patch<{ message: string; reservation: Reservation }>(
      `${API_URL}/reservations/${id}/refuser`, { motif })
  }

  annuler(id: number) {
    return this.http.patch<{ message: string; reservation: Reservation }>(
      `${API_URL}/reservations/${id}/annuler`, {})
  }
}
