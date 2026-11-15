# AIpex Digital — Design system « Speckled graphite »

Brief : une agence technique et sérieuse, pas une startup « IA » de plus. Matière minérale (graphite moucheté, comme une pierre ou un plan de travail en granit), typographie éditoriale, un seul accent : le bleu du logo.

Tous les tokens sont dans `css/style.css` (`:root`). Ne pas coder de valeurs en dur.

## Couleurs

| Rôle | Token | Valeur |
|---|---|---|
| Fond sombre (hero, méthode, CTA) | `--g-900` / `--g-850` | #151617 / #1b1c1e |
| En-tête, pied de page | `--g-950` | #0e0f10 |
| Fond clair | `--g-100` / `--g-50` | #e9e9e7 / #f3f3f1 |
| Texte sur sombre / secondaire | `--text-on-dark` / `--muted-on-dark` | contraste 15:1 / 7,6:1 |
| Texte sur clair / secondaire | `--text-on-light` / `--muted-on-light` | contraste 15:1 / 6,9:1 |
| **Accent unique** | `--accent` (sur sombre), `--accent-strong` (boutons, texte sur clair) | #4a90ff / #1f63d6 |
| Erreur (sémantique uniquement) | `--danger` | #d4423b |

Règles : pas de dégradé, pas de violet, pas de seconde couleur d'accent. Le bleu sert aux actions et aux repères (numéros, coches), jamais à décorer.

## Texture

Deux tuiles PNG de 240 px (`assets/img/speckle-dark.png`, `speckle-light.png`, ~15 Ko chacune), appliquées via `--speckle-dark` / `--speckle-light`. Classes de surface : `.surface-dark`, `.surface-dark-alt`, `.surface-light-alt` (le fond clair est celui du `body`).

## Typographie

- Titres H1/H2 : **Instrument Serif** 400, `text-wrap: balance`.
- Texte et H3 : **Instrument Sans** 400/500/600.
- Chiffres (prix, numéros d'étape) : classe `.num` → chiffres tabulaires.
- Pas d'italique décorative, pas de police mono.

## Espacements

Échelle 4 px : `--s-1` (4) · `--s-2` (8) · `--s-3` (12) · `--s-4` (16) · `--s-5` (24) · `--s-6` (32) · `--s-7` (48) · `--s-8` (64) · `--s-9` (96). Sections : `--section-y`.

## Rayons

Un seul rayon : `--radius: 6px` (boutons, champs, cartes de prix). Pour un conteneur qui en entoure un autre : rayon extérieur = rayon intérieur + padding (ex. sélecteur mensuel/annuel : `calc(var(--radius) + var(--s-1))`).

## Composants

- **Boutons** : `.btn-primary` (une seule action principale par section, en général « Prendre rendez-vous »), `.btn-ghost` (secondaire), `.text-link` (tertiaire). Hauteur min. 48 px. État `.is-loading` avec spinner.
- **Icônes** : sprite SVG inline en haut de chaque page (`#i-arrow`, `#i-check`, `#i-mail`…), trait 1,6, style Lucide. Pas d'emoji ni de caractères Unicode en guise d'icône.
- **Listes plutôt que cartes** : les expertises, principes et FAQ sont des lignes séparées par des filets. Les cartes sont réservées aux tarifs et au formulaire.

## Mouvement

Uniquement pour un retour utile : apparition au scroll (désactivée sous `prefers-reduced-motion`), flèches qui avancent au survol, prix qui glissent au changement mensuel/annuel, erreurs de champ qui apparaissent, coche animée à l'envoi réussi.
