// ------Importer framework Express, Mongoose et path--------
const mongoose = require('mongoose');
const express = require ('express');

// require("dotenv").config();
// console.log(process.env);

const path = require('path');
// -------fin de l'import framework --------------------------

// importation des routes
const sauceRoutes   = require ('./routes/sauce');
const userRoutes    = require ('./routes/user');

// ------------------connecter notre API au cluster de MongoDB Atlas ------------------------------------
mongoose.connect('mongodb+srv://nboussem81:Myosotis2020@cluster0.zvfal2f.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
// ------fin MongoDB Atlas connect à cluster----------------------------------------------------------------

// ---appel méthode express-----
const app = express();
// accéder au corps de la requête json.body
app.use(express.json());

// Controle d'accès - les headers permettent de faire des requêtes cross-origin (empêcher des erreurs CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// -----fin contrôle d'accès routes générales------------------

// ----configuration du serveur pour renvoyer des fichiers statiques pour une route donnée--
app.use('/images', express.static(path.join(__dirname, 'images')));
// ---fin config gestion des images en statique-----

// ----sauvegarder les routes d'authentification -----------
app.use ('/api/auth', userRoutes);
app.use ('/api/sauces', sauceRoutes);
// ----fin des routes d'authentification-------------------

// ----Exporter l'application/constante pour acceder aux fichiers depuis notre server node---
module.exports = app;
// ----fin : exporter l'application (const app)-----