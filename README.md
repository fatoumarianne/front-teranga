# Application de réservation — Club Sportif Teranga

Frontend développé avec **Angular 22**, en architecture standalone, signals
et nouveau control flow.

---

## Installation

Prérequis : Node.js 18 ou plus récent.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm start
```

L'application est alors disponible sur `http://localhost:4200`.

**Le backend Laravel doit tourner en parallèle** sur `http://localhost:8000`
(`php artisan serve` dans le dossier `api-teranga`). L'adresse de l'API est
définie dans `src/app/core/environnement.ts`.

### Comptes de démonstration

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Administrateur | `admin@teranga.sn` | `password` |
| Membre | `fatou@teranga.sn` | `password` |

---

## Organisation du code

```
src/app/
  core/                    code transverse, sans interface
    modeles.ts             types des données échangées avec l'API
    environnement.ts       adresse de l'API
    dates.ts               mise en forme des dates en français
    formulaire.ts          helpers de saisie et de messages d'erreur
    services/              un service par ressource de l'API
    intercepteurs/         ajout automatique du jeton d'authentification
    gardes/                protection des routes
  composants/              composants réutilisables
  pages/                   un dossier par écran
    admin/                 écrans réservés à l'administrateur
```

Chaque composant suit la règle du cours : **trois fichiers séparés**, le
`.ts` pour la logique, le `.html` pour le template et le `.css` pour le
style, reliés par `templateUrl` et `styleUrl`.

---

## Les conventions Angular 22 utilisées

**Composants standalone.** Aucun `NgModule` : chaque composant déclare
lui-même ce dont il a besoin dans son tableau `imports`.

**Signals pour l'état.** `signal()` pour une valeur réactive, `computed()`
pour une valeur dérivée. Par exemple, dans « Mes réservations », la liste
filtrée est un `computed()` : elle se recalcule toute seule quand le filtre
ou la liste changent, sans qu'on ait à la mettre à jour à la main.

**Control flow moderne.** `@if` / `@else`, `@for` avec `track`, `@empty`
pour les listes vides, `@switch` pour les cas multiples. Les anciennes
directives `*ngIf` et `*ngFor` ne sont utilisées nulle part.

**`input()` et `output()` en fonctions.** Le composant
`ReservationCarteComponent` reçoit sa réservation par
`input.required<Reservation>()` et signale une demande d'annulation à son
parent par `output<number>()`, sans savoir lui-même comment l'annulation est
effectuée.

**`inject()` plutôt que le constructeur.** Tous les services, gardes et
intercepteurs utilisent `inject()`.

**Services avec `providedIn: 'root'`.** Une seule instance partagée par
toute l'application. Le `NotificationService` expose son compteur en lecture
seule avec `asReadonly()` : seul le service peut le modifier.

> À noter : le cours présente aussi `httpResource()` comme alternative
> déclarative à `HttpClient` + `subscribe()`. Le code utilise ici la
> seconde approche partout, pour rester cohérent entre les écrans de
> lecture et ceux qui modifient des données. Sur un écran purement en
> lecture comme la liste des ressources, `httpResource()` serait un
> remplacement direct si vous souhaitez le montrer.

---

## Les écrans

### Membre

- **Connexion / Inscription** — formulaires reliés aux signals par event binding
- **Disponibilités** — calendrier FullCalendar des créneaux occupés, filtrable par ressource
- **Réserver** — formulaire de demande, avec aperçu de la ressource choisie
- **Mes réservations** — liste filtrable, annulation possible
- **Notifications** — messages du club, marquage comme lu

### Administrateur

- **Tableau de bord** — compteurs et deux graphiques Chart.js
- **Demandes** — validation ou refus avec motif obligatoire
- **Ressources** — création, modification et suppression des salles et équipements
- **Membres** — recherche, activation et désactivation des comptes

---

## L'authentification

Après la connexion, le jeton renvoyé par Laravel est conservé dans le
`localStorage`. L'intercepteur `jeton.interceptor.ts` l'ajoute
automatiquement à chaque requête sortante, ce qui évite de le faire à la
main dans chaque service.

Les gardes `gardeConnecte` et `gardeAdministrateur` empêchent d'ouvrir une
page sans les droits nécessaires. **C'est un confort d'interface, pas une
mesure de sécurité** : la véritable protection est côté serveur, où chaque
route vérifie le jeton et le rôle. Un utilisateur qui contournerait la garde
du navigateur se heurterait quand même au refus de l'API.
