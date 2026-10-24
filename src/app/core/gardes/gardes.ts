import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthService } from '../services/auth.service'

/**
 * Garde d'authentification : empeche d'ouvrir une page sans etre connecte.
 *
 * C'est un confort d'interface, pas une mesure de securite : la vraie
 * protection est cote serveur, ou chaque route verifie le jeton et le role.
 */
export const gardeConnecte: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.estConnecte()) {
    return true
  }

  router.navigate(['/connexion'])
  return false
}

/** Garde d'administration : reserve une page a l'administrateur. */
export const gardeAdministrateur: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.estAdministrateur()) {
    return true
  }

  router.navigate(['/disponibilites'])
  return false
}
