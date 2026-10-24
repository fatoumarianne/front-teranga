import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs'

import { API_URL } from '../environnement'
import { Collection, Utilisateur } from '../modeles'

/** Gestion des comptes, reservee a l'administrateur. */
@Injectable({ providedIn: 'root' })
export class MembreService {
  private http = inject(HttpClient)

  lister(recherche = '') {
    let params = new HttpParams()
    if (recherche) {
      params = params.set('recherche', recherche)
    }

    return this.http
      .get<Collection<Utilisateur>>(`${API_URL}/membres`, { params })
      .pipe(map(r => r.data))
  }

  creer(donnees: Partial<Utilisateur> & { mot_de_passe: string }) {
    return this.http.post<{ message: string; membre: Utilisateur }>(
      `${API_URL}/membres`, donnees)
  }

  modifier(id: number, donnees: Partial<Utilisateur>) {
    return this.http.put<{ message: string; membre: Utilisateur }>(
      `${API_URL}/membres/${id}`, donnees)
  }

  basculerStatut(id: number) {
    return this.http.patch<{ message: string; membre: Utilisateur }>(
      `${API_URL}/membres/${id}/statut`, {})
  }
}
