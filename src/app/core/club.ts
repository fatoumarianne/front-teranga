/**
 * Les informations du club.
 *
 * Elles sont ecrites ici une seule fois, puis reprises par la page de
 * contact et par le pied de page. Le club n'ayant qu'une seule adresse,
 * ces valeurs ne proviennent pas de la base de donnees : pour les
 * modifier, il suffit de changer ce fichier.
 */
export const CLUB = {
  nom: 'Club Sportif Teranga',
  adresse: 'Unité 15, Cité Keur Massar',
  ville: 'Keur Massar, Dakar — Sénégal',
  telephone: '+221 77 123 45 67',
  telephone2: '+221 33 879 00 12',
  email: 'contact@teranga.sn',
}

/** Horaires d'ouverture affiches sur la page de contact et dans le pied. */
export const HORAIRES = [
  { jours: 'Lundi — Vendredi', heures: '08h00 — 22h00' },
  { jours: 'Samedi', heures: '09h00 — 20h00' },
  { jours: 'Dimanche', heures: '14h00 — 19h00' },
]

/**
 * Moyens de paiement acceptes au secretariat.
 *
 * Les cotisations ne sont pas reglees dans l'application : celle-ci gere
 * la reservation, pas l'encaissement. L'information est affichee pour
 * renseigner le visiteur.
 */
export const MOYENS_PAIEMENT = ['Wave', 'Orange Money', 'Espèces']

/** Le numero sans espaces, pour un lien d'appel. */
export function lienTelephone(numero: string = CLUB.telephone): string {
  return 'tel:' + numero.replace(/\s/g, '')
}

/** Recherche de l'adresse du club sur une carte. */
export function lienCarte(): string {
  return 'https://www.google.com/maps/search/?api=1&query='
    + encodeURIComponent(`${CLUB.adresse}, ${CLUB.ville}`)
}

/** Ouverture d'une conversation WhatsApp avec le secretariat. */
export function lienWhatsapp(): string {
  return 'https://wa.me/' + CLUB.telephone.replace(/\D/g, '')
}
