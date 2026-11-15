# AIpex Digital — site web

Site vitrine statique (HTML/CSS/JS) pour AIpex Digital — création de sites web, SEO, SEA et consulting en automatisation IA.

## Structure

```
index.html             Accueil
offres.html            Tarifs + détail des offres (ancres : #tarifs, #web, #seo, #sea, #ia)
a-propos.html          À propos / principes
contact.html           Formulaire de contact + FAQ
mentions-legales.html  Mentions légales (champs [à compléter])
confidentialite.html   Politique de confidentialité RGPD (champs [à compléter])
404.html               Page d'erreur personnalisée (chemins absolus /...)
contact.php            Traitement du formulaire (PHP mail, honeypot + délai anti-bot)
.htaccess              HTTPS forcé, 404, en-têtes de sécurité, cache (Apache / OVH)
css/style.css          Design system « Phosphor terminal » (voir DESIGN.md)
js/main.js             Menu mobile, animations, FAQ, tarifs, validation et envoi du formulaire
assets/img/            logo-phosphor-840/1400.jpg (logo), og-image.jpg (partage social 1200×630)
assets/fonts/          Polices WOFF2 hébergées sur le site (Chakra Petch, IBM Plex Sans/Mono, DotGothic16)
_sources/              Logos sources haute définition (non publiés : ignorés par GitHub Pages et bloqués par .htaccess)
icons/                 Favicons et icônes PWA
site.webmanifest, robots.txt, sitemap.xml
```

Le design system (couleurs, typographie, espacements, rayons, composants) est documenté dans `DESIGN.md`.

Pas de framework, pas de build : les fichiers peuvent être ouverts ou déployés tels quels.

## À personnaliser avant mise en ligne

- **Email de contact** : remplacer `contact@aipex-digital.com` dans `contact.php` (variable `$destinationEmail`) et dans les pages HTML (liens `mailto:` et pied de page).
- **Nom de domaine** : mettre à jour les URLs `https://www.aipex-digital.com/...` dans les balises `<link rel="canonical">`, `og:*`, `robots.txt` et `sitemap.xml` une fois le domaine définitif connu.
- **Mentions légales et confidentialité** : remplacer les champs surlignés `[raison sociale]`, `[SIRET]`, `[adresse]`… (obligatoire avant mise en ligne).
- **Réseaux sociaux** : les liens ont été retirés du pied de page tant qu'ils pointaient vers `#`. Les rajouter dans `.footer-bottom` une fois les comptes créés.
- **Prise de rendez-vous** : le formulaire fait office de demande de RDV (champ « Prise de rendez-vous »). Pour un vrai calendrier en ligne, ajouter un lien Calendly (ou équivalent) dans l'élément « Rendez-vous » de `contact.html`.
- **Mesure d'audience** : aucune n'est installée, donc aucun bandeau cookies n'est nécessaire. Pour en ajouter une sans bandeau, choisir un outil exempté de consentement par la CNIL (ex. Matomo configuré en mode exempté, Plausible) et mettre à jour les mentions légales.
- **Photos** : le site n'utilise que le logo. Des photos réelles (équipe, réalisations clients) renforceraient la crédibilité.

## Aperçu en local

Python n'étant pas requis, un mini-serveur PowerShell est fourni :

```bash
powershell -ExecutionPolicy Bypass -File .claude/serve.ps1
```

Puis visiter `http://localhost:8420`. (Avec Python : `python -m http.server 8000`.)

Le formulaire de contact nécessite PHP : `python -m http.server` ne l'exécutera pas (le JS bascule alors automatiquement sur un lien `mailto:`). Pour tester `contact.php` en local, utiliser le serveur intégré de PHP :

```bash
php -S localhost:8000
```

## Déploiement GitHub Pages (aperçu)

Le dépôt est configuré pour publier automatiquement la branche `main` via GitHub Pages. GitHub Pages ne supporte pas PHP : `contact.php` n'y fonctionnera pas (le formulaire bascule alors sur `mailto:`). Cette version sert uniquement de **prévisualisation** du design.

## Déploiement sur OVH (production)

1. Se connecter à l'espace client OVH et récupérer les identifiants FTP de l'hébergement mutualisé.
2. Se connecter en FTP/SFTP (ex. FileZilla) sur `ftp.votre-domaine.fr`.
3. Copier l'intégralité du contenu de ce dépôt (à l'exception de `README.md`, `DESIGN.md`, `_sources/`, `.claude/`, `.impeccable/`, `.git/`, `.gitignore`) dans le dossier racine `www/` de l'hébergement.
4. Vérifier que `contact.php` fonctionne (les hébergements mutualisés OVH supportent `mail()` nativement) et que l'adresse `$destinationEmail` est correcte.
5. Pointer le nom de domaine vers l'hébergement OVH si ce n'est pas déjà fait (zone DNS).
6. Mettre à jour les URLs absolues (canonical, sitemap, robots.txt) avec le domaine définitif si différent de celui utilisé dans ce dépôt.
