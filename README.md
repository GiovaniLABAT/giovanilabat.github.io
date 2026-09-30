# Portfolio — Giovani Labat

Site statique (HTML / CSS / JS, sans build). Gabarit inspiré de xhulia.com.

## Lancer en local

```bash
python3 -m http.server 4599 --bind 127.0.0.1
```

Puis ouvrir http://localhost:4599

## Pages

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil : héro (pilules Matter.js) + les 3 projets empilés |
| `bellross.html` | Projet 1 : Bell & Ross, site web et lancements |
| `extranet-sav.html` | Projet 2 : Extranet SAV (avant / après) |
| `connect-station.html` | Projet 3 : Connect Station (maquette 3D) |
| `about.html` | Me voilà (à propos) |
| `cv.html` | CV (version web provisoire, en attendant le PDF) |
| `playground.html` | **Désactivée** : retirée du menu, conservée pour plus tard |

## Dossiers

```
assets/
  css/site.css        styles communs (jetons clair/sombre, nav, footer, composants des pages projet, animations)
  js/site.js          scripts communs (thème, barre de lecture, sliders, avant/après, 3D, apparitions au défilement)
  img/bellross/       images du projet Bell & Ross (site/, campagnes/, campagnes/video/)
  img/sav/            images de l'extranet SAV (anciens écrans anonymisés, nouvelles maquettes)
  img/bus/            images de Connect Station
  img/playground/     visuels du Playground (page désactivée)
  img/moi/            photos de la page « Me voilà » + avatar de l'accueil
  video/              vidéo « Draw my life » (chargée seulement au clic) + son image d'aperçu
  docs/               PDF : CV (cv-giovani-labat.pdf) et article
  favicon.svg, og-image.jpg   icône du site et image d'aperçu des liens partagés
  3d/connect-station/ maquette 3D (Three.js en local, 13 modules)
sources/              originaux non publiés (images brutes, PDF, projet 3D complet) — rien ici n'est chargé par le site
```

## Mise en ligne (GitHub Pages, gratuit)

Le site est publié depuis la branche `main` du dépôt `GiovaniLABAT/giovanilabat.github.io` :
https://giovanilabat.github.io

Pour publier une modification :

```bash
git add -A && git commit -m "Mise à jour" && git push
```

La mise en ligne prend environ une minute. Le dossier `sources/` n'est jamais publié (voir `.gitignore`).
