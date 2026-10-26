import { Component, inject } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

/**
 * Page de contact, publique.
 *
 * Elle regroupe les coordonnees du club et sa localisation, pour qu'un
 * visiteur puisse appeler, ecrire ou s'y rendre sans avoir a creer un
 * compte. Les informations sont fixes : elles ne proviennent pas de la base
 * de donnees, le club n'ayant qu'une seule adresse.
 */
@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private sanitizer = inject(DomSanitizer)

  /** Coordonnees affichees sur la page et reprises dans les liens. */
  club = {
    nom: 'Club Sportif Teranga',
    adresse: 'Unité 15, Cité Keur Massar',
    ville: 'Keur Massar, Dakar — Sénégal',
    telephone: '+221 77 123 45 67',
    telephone2: '+221 33 879 00 12',
    email: 'contact@teranga.sn',
  }

  /** Numero sans espaces, pour le lien d'appel. */
  get lienTelephone(): string {
    return 'tel:' + this.club.telephone.replace(/\s/g, '')
  }

  /** Recherche de l'adresse sur une carte. */
  get lienCarte(): string {
    return 'https://www.google.com/maps/search/?api=1&query='
      + encodeURIComponent(`${this.club.adresse}, ${this.club.ville}`)
  }

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

  horaires = [
    { jours: 'Lundi — Vendredi', heures: '08h00 — 22h00' },
    { jours: 'Samedi', heures: '09h00 — 20h00' },
    { jours: 'Dimanche', heures: '14h00 — 19h00' },
  ]
}
