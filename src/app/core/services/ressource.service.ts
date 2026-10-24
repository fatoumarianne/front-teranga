import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs'

import { API_URL } from '../environnement'
import { Collection, Ressource, TypeRessource } from '../modeles'

/** Salles et equipements du club. */
@Injectable({ providedIn: 'root' })
export class RessourceService {
  private http = inject(HttpClient)

  lister(filtres: { type?: TypeRessource; disponible?: boolean } = {}) {
    let params = new HttpParams()
    if (filtres.type) {
      params = params.set('type', filtres.type)
    }
    if (filtres.disponible !== undefined) {
      params = params.set('disponible', String(filtres.disponible))
    }

    return this.http
      .get<Collection<Ressource>>(`${API_URL}/ressources`, { params })
      .pipe(map(r => r.data))
  }

  detail(id: number) {
    return this.http
      .get<{ data: Ressource }>(`${API_URL}/ressources/${id}`)
      .pipe(map(r => r.data))
  }

  creer(donnees: Partial<Ressource>) {
    return this.http.post<{ message: string; ressource: Ressource }>(
      `${API_URL}/ressources`, donnees)
  }

  modifier(id: number, donnees: Partial<Ressource>) {
    return this.http.put<{ message: string; ressource: Ressource }>(
      `${API_URL}/ressources/${id}`, donnees)
  }

  supprimer(id: number) {
    return this.http.delete<{ message: string }>(`${API_URL}/ressources/${id}`)
  }
}
