# AIpex Digital — Design system « Phosphor terminal »

Brief : rétro-futurisme / Matrix / Technonippon. Le site se lit comme une console d'agence : écran phosphore orange sur noir chaud, cadres HUD à angles vifs, libellés de terminal, relief en fil de fer, accents japonais. Références : planches Pinterest « Super Terrain 86 », interfaces HUD rétro et affiches techno japonaises des années 90. Tout est réinterprété, rien n'est copié.

Tous les tokens sont dans `css/style.css` (`:root`). Ne pas coder de valeurs en dur.

## Couleurs

| Rôle | Token | Valeur |
|---|---|---|
| Fond de page / panneaux / champs | `--ink-0` / `--ink-1` / `--ink-2` | #0a0908 / #12100e / #1b1815 |
| Section papier (tarifs) | `--paper` / `--paper-2` | #e8d8c9 / #f2e8dd |
| Texte / secondaire (sur noir) | `--text` / `--muted` | 16:1 / 7,2:1 |
| Texte / secondaire (sur papier) | `--paper-ink` / `--paper-muted` | 13:1 / 5,6:1 |
| **Accent unique : phosphore** | `--phosphor` (sur noir), `--phosphor-hi` (survol des boutons), `--phosphor-ink` (texte accent sur papier) | #ff6a1a / #ff8c4d / #9a3404 |
| Dérivés (filets, halos) | `--phosphor-line`, `--phosphor-faint`, `--phosphor-glow` | `color-mix()` du phosphore |
| Erreur | `--danger` | #ff5a52 |

Règles :
- Un seul accent, l'orange phosphore. Les boutons pleins portent du texte **noir**, à 6,9:1, et passent à 8,9:1 au survol : le survol éclaircit, ce qui est sûr ici puisque le texte est sombre.
- Pas de dégradé décoratif, pas de violet, pas de bleu.
- **Un seul halo** : le `text-shadow` du titre accentué du hero. Partout ailleurs, l'accent passe par la couleur, un filet ou une inversion, jamais par une lueur.

## Matière

- **Grille de points** et **lignes de balayage** dans le fond de `body`. Elles n'apparaissent que là où le fond noir est visible, jamais sur le papier.
- **Équerres HUD** : classe `.hud`, quatre coins dessinés en dégradés CSS, taille `--bracket`.
- **Barre de titre** de panneau : `.hud-bar`, libellé de terminal à gauche et japonais à droite.
- **Barre système** en tête de section : `.sys-bar`, de la forme « code ——— 日本語 ««« ». Elle fait partie du cadre, pas du titre, et elle est `aria-hidden`.
- **Colonnes de katakana** : `.glyph-rain`, statiques, à 10-18 % d'opacité, `aria-hidden`. C'est le clin d'œil Matrix.

## Typographie

| Usage | Police |
|---|---|
| Titres H1/H2, prix, mot-symbole | **Chakra Petch** 600, en capitales |
| Texte, H3 | **IBM Plex Sans** 400/600 |
| Libellés de terminal, boutons, navigation, chiffres | **IBM Plex Mono** 400/500 (chiffres tabulaires) |
| Japonais | **DotGothic16**, en sous-ensemble : seuls les glyphes utilisés sont chargés |

Le japonais est décoratif. Il double toujours un libellé français, ne le remplace jamais, et porte `lang="ja"`.

Les polices sont **hébergées sur le site** (`assets/fonts/`, 77 Ko au total, sous-ensemble latin), déclarées en tête de `css/style.css`, avec Chakra Petch et Plex Sans préchargées. Si vous ajoutez un caractère japonais, régénérez `dotgothic16-400.woff2` depuis Google Fonts avec le paramètre `text=` contenant tous les glyphes utilisés.

Les citations et paragraphes restent en casse normale : les capitales sont réservées aux titres courts, aux boutons et aux libellés.

## Espacements et forme

- Échelle 4 px : `--s-1` à `--s-9` ; sections : `--section-y`.
- Rayon : **aucun** (`--radius: 0`). Les angles sont marqués par les équerres, jamais arrondis.

## Logo

- **Logo complet** (panthère et monogramme « AI » en orange néon) : `assets/img/logo-phosphor-840.jpg` / `-1400.jpg`, dans le panneau « dossier » d'À propos et sur l'image de partage.
- **Monogramme** (recadré sur le « AI ») : favicons, icônes PWA, et marque de 28 px dans l'en-tête et le pied de page.
- Le PNG source haute définition et les anciens logos bleus sont rangés dans `_sources/`, qui n'est pas publié.

## Composants

- **Boutons** : `.btn-primary` (phosphore plein, une seule action principale par section), `.btn-ghost` (filet), `.text-link`. Libellés en mono capitales, hauteur min. 48 px. Pendant l'envoi : « TRANSMISSION… » clignotant.
- **Icônes** : sprite SVG inline, trait 1,6, angles vifs (`stroke-linejoin: miter`). Pas d'emoji ni de caractère Unicode en guise d'icône.
- **Lignes plutôt que cartes** : expertises, offres, FAQ. Les panneaux `.hud` sont réservés au terrain du hero, au formulaire, au dossier « À propos » et aux bandeaux d'appel à l'action.
- **Tarifs** : section papier ; la formule recommandée est un panneau noir à filet phosphore.

## Mouvement

Un seul moment animé : le **relief en fil de fer** du hero (`#terrain`, canvas). Une ligne de scan le balaie, et une cible marque le sommet « PAGE 1 // GOOGLE ». L'animation tourne à 30 images/s, se met en pause hors écran et quand l'onglet est caché, et affiche une image fixe sous `prefers-reduced-motion`.

Le reste ne sert qu'au retour d'état : apparition au scroll, scintillement des prix au changement mensuel/annuel, erreurs de champ, coche animée à l'envoi.
