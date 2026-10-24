/**
 * Petit utilitaire partage par les formulaires.
 *
 * Le cours relie les champs de saisie aux signals par event binding :
 *   <input [value]="email()" (input)="email.set(valeur($event))">
 *
 * Cette fonction evite de repeter la conversion de l'evenement dans chaque
 * composant, tout en gardant le typage strict des templates.
 */
export function valeur(evenement: Event): string {
  return (evenement.target as HTMLInputElement).value
}

/**
 * Extrait un message lisible d'une erreur HTTP renvoyee par Laravel.
 *
 * Laravel renvoie soit { message: "..." }, soit, pour une erreur de
 * validation (422), { message, errors: { champ: ["..."] } }.
 */
export function messageErreur(erreur: unknown, defaut = 'Une erreur est survenue.'): string {
  const e = erreur as { error?: { message?: string; errors?: Record<string, string[]> } }

  const erreurs = e?.error?.errors
  if (erreurs) {
    const premier = Object.values(erreurs)[0]
    if (premier && premier.length > 0) {
      return premier[0]
    }
  }

  return e?.error?.message ?? defaut
}
