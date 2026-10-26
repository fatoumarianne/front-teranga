import { Routes } from '@angular/router'

import { gardeAdministrateur, gardeConnecte } from './core/gardes/gardes'

/**
 * Routes de l'application.
 *
 * Les pages sont chargees a la demande (loadComponent) : le navigateur ne
 * telecharge le code d'un ecran que lorsque l'utilisateur s'y rend, ce qui
 * allege le premier chargement.
 */
export const routes: Routes = [
  {
    path: 'connexion',
    loadComponent: () =>
      import('./pages/connexion/connexion.component').then(m => m.ConnexionComponent),
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('./pages/inscription/inscription.component').then(m => m.InscriptionComponent),
  },

  // ------------------------------------------------- membre et admin

  {
    path: 'disponibilites',
    canActivate: [gardeConnecte],
    loadComponent: () =>
      import('./pages/disponibilites/disponibilites.component').then(m => m.DisponibilitesComponent),
  },
  {
    path: 'reserver',
    canActivate: [gardeConnecte],
    loadComponent: () =>
      import('./pages/reserver/reserver.component').then(m => m.ReserverComponent),
  },
  {
    path: 'mes-reservations',
    canActivate: [gardeConnecte],
    loadComponent: () =>
      import('./pages/mes-reservations/mes-reservations.component').then(m => m.MesReservationsComponent),
  },
  {
    path: 'notifications',
    canActivate: [gardeConnecte],
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
  },
  {
    path: 'profil',
    canActivate: [gardeConnecte],
    loadComponent: () =>
      import('./pages/profil/profil.component').then(m => m.ProfilComponent),
  },

  // ---------------------------------------------- administrateur

  {
    path: 'admin',
    canActivate: [gardeConnecte, gardeAdministrateur],
    children: [
      {
        path: 'tableau-de-bord',
        loadComponent: () =>
          import('./pages/admin/tableau-de-bord/tableau-de-bord.component').then(m => m.TableauDeBordComponent),
      },
      {
        path: 'demandes',
        loadComponent: () =>
          import('./pages/admin/demandes/demandes.component').then(m => m.DemandesComponent),
      },
      {
        path: 'ressources',
        loadComponent: () =>
          import('./pages/admin/ressources/ressources.component').then(m => m.RessourcesComponent),
      },
      {
        path: 'membres',
        loadComponent: () =>
          import('./pages/admin/membres/membres.component').then(m => m.MembresComponent),
      },
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
    ],
  },

  { path: '', redirectTo: 'disponibilites', pathMatch: 'full' },
  { path: '**', redirectTo: 'disponibilites' },
]
