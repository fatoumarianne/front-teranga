/**
 * Mise en forme des dates en francais.
 *
 * On formate en TypeScript plutot qu'avec DatePipe : cela evite d'avoir a
 * enregistrer la locale francaise dans toute l'application, et le resultat
 * est directement lisible dans les templates.
 */

export function dateHeure(iso: string | null | undefined): string {
  if (!iso) {
    return '—'
  }
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function dateSeule(iso: string | null | undefined): string {
  if (!iso) {
    return '—'
  }
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/** « le 14/06/2026 de 18:00 à 20:00 », ou les deux dates si le jour differe. */
export function creneau(debut: string, fin: string): string {
  const d = new Date(debut)
  const f = new Date(fin)

  const heure = (x: Date) =>
    x.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  if (d.toDateString() === f.toDateString()) {
    const jour = d.toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long',
    })
    return `${jour} de ${heure(d)} à ${heure(f)}`
  }

  return `du ${dateHeure(debut)} au ${dateHeure(fin)}`
}

/** Libelle lisible d'un statut de reservation. */
export function libelleStatut(statut: string): string {
  switch (statut) {
    case 'en_attente': return 'En attente'
    case 'validee': return 'Validée'
    case 'refusee': return 'Refusée'
    case 'annulee': return 'Annulée'
    default: return statut
  }
}
