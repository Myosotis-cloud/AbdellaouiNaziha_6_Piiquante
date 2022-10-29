# Piiquante

## Mission

Construction de l'API du site Piiquante (galerie de sauces piquantes).

### Fonctionnalités

Du point de vue des **fonctionnalités**, l’API va permettre à un utilisateur :

- **De créer un compte et de s’y connecter**
    - système d’authentification
- **D’accéder à tous les fonctions de l’application**, à savoir
    - Créer une sauce
        - avec la possibilité de télécharger une image
    - Modifier sa sauce
    - Supprimer sa sauce
    - D’accéder à la liste de toutes les sauces
    - Pouvoir lire les informations d’une sauce en particulier
    - De liker ou disliker une sauce partagée par un autre utilisateur

## Technos (back-end)

- Node.js
- Express
- MongoDB

## Installation

Pré-requis : utilisation de Node.js version 18.12.0.

### Back-end

Dans le dossier backend, taper `npm install`.

Utiliser le fichier .env.example pour créer un fichier .env et remplir les informations sur la base de données, la clé de chiffrement CryptoJS et la clé secrète pour le token.

Lancement du serveur : `node server` ou `nodemon server`, `npm run start`

URL du serveur : [http://localhost:3000](http://localhost:3000).

### Front-end

Dans le dossier frontend, taper `npm install` puis `npm start`.
Lancement du serveur local et du site : `npm run start`.

URL du site : [http://localhost:4200](http://localhost:4200/)

---

(Projet n°6 du parcours Développeur Web de OpenClassrooms - septembre/octobre 2022)
