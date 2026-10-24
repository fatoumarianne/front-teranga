import { HttpClient } from '@angular/common/http'
import { Injectable, inject, signal } from '@angular/core'
import { map, tap } from 'rxjs'

import { API_URL } from '../environnement'
import { Collection, Notification } from '../modeles'

/**
 * Notifications de l'utilisateur connecte.
 *
 * Le compteur de non-lues est expose en lecture seule : seul le service peut
 * le modifier, les composants se contentent de le lire. C'est le modele
 * « signal prive + asReadonly » du cours.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient)

  private _nonLues = signal(0)
  nonLues = this._nonLues.asReadonly()

  lister() {
    return this.http
      .get<Collection<Notification>>(`${API_URL}/notifications`)
      .pipe(map(r => r.data))
  }

  rafraichirCompteur() {
    return this.http
      .get<{ non_lues: number }>(`${API_URL}/notifications/non-lues`)
      .pipe(tap(r => this._nonLues.set(r.non_lues)))
  }

  marquerLue(id: number) {
    return this.http
      .patch<{ message: string }>(`${API_URL}/notifications/${id}/lue`, {})
      .pipe(tap(() => this._nonLues.update(n => Math.max(0, n - 1))))
  }

  toutMarquerLues() {
    return this.http
      .patch<{ message: string }>(`${API_URL}/notifications/tout-lire`, {})
      .pipe(tap(() => this._nonLues.set(0)))
  }
}
