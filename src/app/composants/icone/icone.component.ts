import { Component, input } from '@angular/core'

/**
 * Icone de ligne, dessinee en SVG.
 *
 * Les icones sont ecrites ici une seule fois et appelees par leur nom :
 * <app-icone nom="modifier" />. Elles sont tracees en trait, sans
 * remplissage, et prennent la couleur du texte qui les entoure grace a
 * « currentColor » : un bouton rouge porte donc une icone rouge, sans
 * qu'il faille la redessiner.
 *
 * Le trace est inclus dans le gabarit plutot que charge depuis un fichier
 * ou une bibliotheque exterieure : aucune requete supplementaire, et
 * l'icone ne peut pas manquer a l'affichage.
 */
@Component({
  selector: 'app-icone',
  template: `
    <svg [attr.width]="taille()" [attr.height]="taille()" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" [attr.stroke-width]="epaisseur()"
         stroke-linecap="round" stroke-linejoin="round"
         class="icone" aria-hidden="true" focusable="false">
      @switch (nom()) {
        @case ('ajouter') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('modifier') {
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        }
        @case ('supprimer') {
          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
        }
        @case ('valider') {
          <path d="M20 6 9 17l-5-5" />
        }
        @case ('refuser') {
          <path d="M18 6 6 18M6 6l12 12" />
        }
        @case ('activer') {
          <path d="M12 3v9M7.5 6a7.5 7.5 0 1 0 9 0" />
        }
        @case ('desactiver') {
          <circle cx="12" cy="12" r="9" />
          <path d="M5.6 5.6l12.8 12.8" />
        }
        @case ('annuler') {
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-6 6M9 9l6 6" />
        }
        @case ('enregistrer') {
          <path d="M5 4h11l4 4v12H5z" />
          <path d="M8 4v5h7V4M8 20v-6h8v6" />
        }
        @case ('rechercher') {
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        }
        @case ('retour') {
          <path d="M19 12H5M11 6l-6 6 6 6" />
        }
      }
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      vertical-align: -0.17em;
    }

    /* l'icone precede un libelle : on les separe d'un demi-caractere */
    :host(.avec-texte) {
      margin-right: 0.4em;
    }
  `],
})
export class IconeComponent {
  /** nom de l'icone a tracer */
  nom = input.required<string>()

  /** cote du carre, en pixels */
  taille = input(16)

  /** epaisseur du trait ; a augmenter si l'icone est tres petite */
  epaisseur = input(1.9)
}
