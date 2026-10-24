import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

import { API_URL } from '../environnement'
import { Statistiques } from '../modeles'

/** Donnees du tableau de bord de l'administrateur. */
@Injectable({ providedIn: 'root' })
export class StatistiqueService {
  private http = inject(HttpClient)

  tableauDeBord() {
    return this.http.get<Statistiques>(`${API_URL}/statistiques`)
  }
}
