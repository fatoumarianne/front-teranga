import { Component, inject } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { CLUB, HORAIRES, lienCarte, lienTelephone } from '../../core/club'

/**
 * Page de contact, publique.
 *
 * Elle regroupe les coordonnees du club et sa localisation, pour qu'un
 * visiteur puisse appeler, ecrire ou s'y rendre sans avoir a creer un
 * compte. Les informations viennent du fichier « core/club », partage avec
 * le pied de page : elles ne sont ecrites qu'une fois.
 */
@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private sanitizer = inject(DomSanitizer)

  club = CLUB
  horaires = HORAIRES

  /** Numero sans espaces, pour le lien d'appel. */
  lienTelephone = lienTelephone()

  /** Recherche de l'adresse sur une carte. */
  lienCarte = lienCarte()

  /**
   * Carte affichee dans la page.
   *
   * Angular refuse par securite une adresse variable dans un cadre intégré :
   * on la marque donc explicitement comme sure, puisqu'elle est construite
   * ici et non fournie par l'utilisateur.
   */
  get carteIntegree(): SafeResourceUrl {
    const url = 'https://maps.google.com/maps?output=embed&z=14&q='
      + encodeURIComponent(`${this.club.adresse}, ${this.club.ville}`)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
