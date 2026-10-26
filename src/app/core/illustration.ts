import { Ressource } from './modeles'

/**
 * Adresse de l'illustration d'une salle ou d'un equipement.
 *
 * La colonne « image » de la table ressource contient soit l'adresse
 * complete d'une photo (elle commence alors par http), soit le nom d'une des
 * illustrations livrees avec l'application, rangees dans public/images.
 * Lorsqu'elle est vide, une illustration par defaut est choisie selon le
 * type de la ressource, pour qu'aucune vignette ne reste blanche.
 */
export function illustrationRessource(r: Ressource): string {
  if (r.image) {
    return r.image.startsWith('http') ? r.image : `images/ressources/${r.image}`
  }

  return r.type === 'salle'
    ? 'images/ressources/salle-basket.svg'
    : 'images/ressources/ballons-basket.svg'
}
