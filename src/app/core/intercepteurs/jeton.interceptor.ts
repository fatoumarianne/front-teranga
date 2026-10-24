import { HttpInterceptorFn } from '@angular/common/http'

/**
 * Ajoute le jeton Sanctum a chaque requete sortante.
 *
 * Le jeton est lu dans le localStorage plutot que depuis le service
 * d'authentification, pour eviter une dependance circulaire entre
 * l'intercepteur et le service.
 */
export const jetonInterceptor: HttpInterceptorFn = (requete, suivant) => {
  const jeton = localStorage.getItem('teranga_token')

  if (!jeton) {
    return suivant(requete)
  }

  return suivant(requete.clone({
    setHeaders: {
      Authorization: `Bearer ${jeton}`,
      Accept: 'application/json',
    },
  }))
}
