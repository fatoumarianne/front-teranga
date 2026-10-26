import { Ressource } from './modeles'

/**
 * Adresse de l'image d'une ressource.
 *
 * La colonne « image » contient soit l'adresse web complete d'une photo,
 * soit le nom d'un fichier range dans « public/images/ressources ». Une
 * ressource sans image recoit une photo par defaut, choisie selon son
 * type, pour qu'aucune vignette ne reste vide.
 */
export function illustrationRessource(r: Ressource): string {
  if (r.image) {
    return r.image.startsWith('http') ? r.image : `images/ressources/${r.image}`
  }

  return r.type === 'salle'
    ? 'images/ressources/salle-basket.webp'
    : 'images/ressources/ballons-basket.webp'
}
