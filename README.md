# Musily, site de test

Site statique : pas de serveur, pas de base de données.

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'accueil |
| `demande.html` | Formulaire « Demander un cours » |
| `prof.html` | Formulaire « Devenir prof » |
| `style.css` | Le style. Couleurs et polices en haut, dans `:root` |
| `script.js` | Réglages (`CONFIG`), batterie jouable, envoi des formulaires |
| `mentions-legales.html` | Mentions légales |
| `confidentialite.html` | Politique de confidentialité |

## 1. Voir le site en local

Ouvre le dossier dans VS Code, installe l'extension **Live Server**, clic droit sur `index.html` puis « Open with Live Server ». Sinon, double-clic sur `index.html`.

## 2. Régler `CONFIG` (en haut de `script.js`)

- `prix` : prix horaire après crédit d'impôt. Le prix plein (x2) se calcule tout seul partout sur la page.
- `email` : l'adresse de contact (déjà réglée sur musily.contact@gmail.com).
- `adresseFormulaire` : voir étape 3.

Le prix est aussi écrit en dur à deux endroits dans le `<head>` de `index.html` (balises `description`), à changer à la main.

## 3. Brancher les formulaires (Formspree)

1. Crée un compte sur formspree.io avec l'adresse mail Musily.
2. Crée un formulaire, copie son adresse (du type `https://formspree.io/f/abcdwxyz`).
3. Colle-la dans `CONFIG.adresseFormulaire`.

Les deux formulaires (élève et prof) arrivent au même endroit, avec un champ `type` pour les distinguer. Tu reçois un mail à chaque envoi et tu peux exporter le tout en CSV. L'offre gratuite est limitée en nombre d'envois par mois : vérifie la limite actuelle, largement suffisante pour un test.

## 4. Compléter les pages légales

Dans `mentions-legales.html` et `confidentialite.html`, remplace tout ce qui est surligné en jaune (`[Prénom NOM]`, adresse, date). Si tu changes d'hébergeur ou d'outil de formulaire, mets à jour les deux mentions correspondantes.

## 5. Mettre en ligne (GitHub Pages, gratuit)

1. Crée un dépôt public sur GitHub, par exemple `musily`.
2. Dans le dossier du site :
   ```
   git init
   git add .
   git commit -m "Première version"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/musily.git
   git push -u origin main
   ```
3. Sur GitHub : Settings > Pages > Source « Deploy from a branch », branche `main`, dossier `/ (root)`.
4. Le site est en ligne une ou deux minutes après sur `https://TON-COMPTE.github.io/musily/`.

Chaque `git push` met le site à jour. Le jour où tu prends un nom de domaine, il se branche dans ce même écran.

## 6. Avant de partager le lien

- Envoie un vrai formulaire élève et un vrai formulaire prof, vérifie que les mails arrivent.
- Teste sur ton téléphone.
- Pour distinguer Insta, TikTok et affiches : ajoute `?src=insta`, `?src=tiktok`, `?src=affiche` à la fin du lien que tu partages (à brancher plus tard dans un champ caché si tu veux le retrouver dans les demandes).
