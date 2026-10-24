import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { jetonInterceptor } from './core/intercepteurs/jeton.interceptor'

/**
 * Configuration globale de l'application.
 *
 * C'est ici qu'on branche le routeur et le client HTTP. L'intercepteur
 * ajoute automatiquement le jeton d'authentification a chaque requete
 * sortante : sans lui, il faudrait le faire a la main dans chaque service.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jetonInterceptor])),
  ],
}
