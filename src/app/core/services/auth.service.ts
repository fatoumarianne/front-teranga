import { HttpClient } from '@angular/common/http'
import { Injectable, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { tap } from 'rxjs'

import { API_URL } from '../environnement'
import { ReponseAuth, Utilisateur } from '../modeles'

const CLE_JETON = 'teranga_token'
const CLE_UTILISATEUR = 'teranga_utilisateur'

/**
 * Authentification et session de l'utilisateur.
 *
 * L'utilisateur courant est stocke dans un signal : toute l'interface qui
 * le lit se met a jour automatiquement a la connexion comme a la
 * deconnexion. Il est aussi recopie dans le localStorage pour que la
 * session survive a un rechargement de la page.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  /** Utilisateur connecte, ou null. */
  utilisateur = signal<Utilisateur | null>(this.lireUtilisateurStocke())

  /** Valeurs derivees, utilisables directement dans les templates. */
  estConnecte = computed(() => this.utilisateur() !== null)
  estAdministrateur = computed(() => this.utilisateur()?.role === 'administrateur')
  estMembre = computed(() => this.utilisateur()?.role === 'membre')

  connexion(email: string, motDePasse: string) {
    return this.http
      .post<ReponseAuth>(`${API_URL}/connexion`, { email, mot_de_passe: motDePasse })
      .pipe(tap(reponse => this.ouvrirSession(reponse)))
  }

  inscription(donnees: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    mot_de_passe: string
    mot_de_passe_confirmation: string
  }) {
    return this.http
      .post<ReponseAuth>(`${API_URL}/inscription`, donnees)
      .pipe(tap(reponse => this.ouvrirSession(reponse)))
  }

  /** Profil de l'utilisateur connecte, recharge depuis le serveur. */
  profil() {
    return this.http
      .get<{ data: Utilisateur }>(`${API_URL}/profil`)
      .pipe(tap(reponse => this.memoriserUtilisateur(reponse.data)))
  }

  /**
   * Mise a jour du profil.
   *
   * Le serveur renvoie l'utilisateur a jour : on le replace dans le signal
   * pour que la barre de navigation affiche aussitot le nouveau nom.
   */
  majProfil(donnees: {
    nom?: string
    prenom?: string
    email?: string
    telephone?: string | null
    mot_de_passe_actuel?: string
    mot_de_passe?: string
    mot_de_passe_confirmation?: string
  }) {
    return this.http
      .put<{ message: string; utilisateur: Utilisateur }>(`${API_URL}/profil`, donnees)
      .pipe(tap(reponse => this.memoriserUtilisateur(reponse.utilisateur)))
  }

  deconnexion() {
    // on previent le serveur pour qu'il revoque le jeton, mais on ferme la
    // session localement dans tous les cas, meme si la requete echoue
    this.http.post(`${API_URL}/deconnexion`, {}).subscribe({
      next: () => this.fermerSession(),
      error: () => this.fermerSession(),
    })
  }

  // ------------------------------------------------------------- interne

  private ouvrirSession(reponse: ReponseAuth) {
    localStorage.setItem(CLE_JETON, reponse.token)
    this.memoriserUtilisateur(reponse.utilisateur)
  }

  private memoriserUtilisateur(utilisateur: Utilisateur) {
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(utilisateur))
    this.utilisateur.set(utilisateur)
  }

  private fermerSession() {
    localStorage.removeItem(CLE_JETON)
    localStorage.removeItem(CLE_UTILISATEUR)
    this.utilisateur.set(null)
    this.router.navigate(['/connexion'])
  }

  private lireUtilisateurStocke(): Utilisateur | null {
    const brut = localStorage.getItem(CLE_UTILISATEUR)
    if (!brut) {
      return null
    }
    try {
      return JSON.parse(brut) as Utilisateur
    } catch {
      return null
    }
  }
}
