/**
 * Types des donnees echangees avec l'API Laravel.
 *
 * Ils reprennent exactement les champs renvoyes par les API Resources du
 * backend, ce qui permet a TypeScript de detecter une faute de frappe sur un
 * nom de propriete avant meme d'executer l'application.
 */

export type Role = 'membre' | 'administrateur'
export type Statut = 'actif' | 'inactif'
export type TypeRessource = 'salle' | 'equipement'
export type StatutReservation = 'en_attente' | 'validee' | 'refusee' | 'annulee'

export interface Utilisateur {
  id: number
  nom: string
  prenom: string
  nom_complet: string
  email: string
  telephone: string | null
  role: Role
  statut: Statut
  date_inscription: string | null
}

export interface Ressource {
  id: number
  type: TypeRessource
  nom: string
  description: string | null
  image: string | null
  disponible: boolean
  capacite?: number | null
  quantite?: number | null
  etat?: string | null
}

export interface Reservation {
  id: number
  statut: StatutReservation
  motif: string | null
  date_demande: string | null
  date_debut: string
  date_fin: string
  /** champs consommes par FullCalendar */
  title?: string
  start: string
  end: string
  color: string
  ressource?: Ressource
  membre?: Utilisateur
  administrateur?: Utilisateur
  annulable: boolean
}

export interface Notification {
  id: number
  message: string
  lu: boolean
  date_envoi: string | null
}

export interface Statistiques {
  compteurs: {
    membres: number
    ressources: number
    salles: number
    equipements: number
    en_attente: number
    validees: number
  }
  par_statut: Record<string, number>
  par_ressource: Record<string, number>
  par_mois: Record<string, number>
  periode: { debut: string; fin: string }
}

/** Enveloppe standard des collections renvoyees par les API Resources. */
export interface Collection<T> {
  data: T[]
}

export interface ReponseAuth {
  message: string
  utilisateur: Utilisateur
  token: string
}
