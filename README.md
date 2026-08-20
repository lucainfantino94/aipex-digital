# AIpex Digital — site web

Site vitrine statique (HTML/CSS/JS) pour AIpex Digital — création de sites web, SEO, SEA et consulting en automatisation IA.

## Structure

```
index.html          Accueil
offres.html          Détail des offres (ancres : #web, #seo, #sea, #ia)
a-propos.html        À propos / principes
contact.html         Formulaire de contact + FAQ
contact.php          Traitement du formulaire (PHP mail) — nécessite un hébergeur PHP
css/style.css        Design system (une seule feuille de style)
js/main.js           Menu mobile, animations au scroll, FAQ, envoi du formulaire
assets/img/          Logo (logo-full.png, logo-mark.png)
icons/                Favicons et icônes PWA
site.webmanifest, robots.txt, sitemap.xml
```

Pas de framework, pas de build : les fichiers peuvent être ouverts ou déployés tels quels.

## À personnaliser avant mise en ligne

- **Email de contact** : remplacer `contact@aipex-digital.com` dans `contact.php` (variable `$destinationEmail`) et dans les pages HTML (liens `mailto:` et pied de page).
- **Nom de domaine** : mettre à jour les URLs `https://www.aipex-digital.com/...` dans les balises `<link rel="canonical">`, `og:*`, `robots.txt` et `sitemap.xml` une fois le domaine définitif connu.
- **Réseaux sociaux** : compléter les liens `#` du pied de page (LinkedIn, Instagram...).
- **Prise de rendez-vous** : le formulaire fait office de demande de RDV (champ « Prise de rendez-vous »). Pour un vrai calendrier en ligne, remplacer le bloc `.map-note` de `contact.html` par un lien/widget Calendly ou équivalent.

## Aperçu en local

Ouvrir simplement `index.html` dans un navigateur, ou lancer un petit serveur local :

```bash
python -m http.server 8000
```

Puis visiter `http://localhost:8000`.

Le formulaire de contact nécessite PHP : `python -m http.server` ne l'exécutera pas (le JS bascule alors automatiquement sur un lien `mailto:`). Pour tester `contact.php` en local, utiliser le serveur intégré de PHP :

```bash
php -S localhost:8000
```

## Déploiement GitHub Pages (aperçu)

Le dépôt est configuré pour publier automatiquement la branche `main` via GitHub Pages. GitHub Pages ne supporte pas PHP : `contact.php` n'y fonctionnera pas (le formulaire bascule alors sur `mailto:`). Cette version sert uniquement de **prévisualisation** du design.

## Déploiement sur OVH (production)

1. Se connecter à l'espace client OVH et récupérer les identifiants FTP de l'hébergement mutualisé.
2. Se connecter en FTP/SFTP (ex. FileZilla) sur `ftp.votre-domaine.fr`.
3. Copier l'intégralité du contenu de ce dépôt (à l'exception de `README.md`, `.git/`, `.gitignore`) dans le dossier racine `www/` de l'hébergement.
4. Vérifier que `contact.php` fonctionne (les hébergements mutualisés OVH supportent `mail()` nativement) et que l'adresse `$destinationEmail` est correcte.
5. Pointer le nom de domaine vers l'hébergement OVH si ce n'est pas déjà fait (zone DNS).
6. Mettre à jour les URLs absolues (canonical, sitemap, robots.txt) avec le domaine définitif si différent de celui utilisé dans ce dépôt.
