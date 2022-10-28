const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// import middleware de verification de validité du token
// tjrs placer middleware d'authentification avant celui des routes - gestion de la sécurité de nos routes
const saucesCtrl = require ('../controllers/sauce');


// route de creation d'une nouvelle sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
// route pour lecture de toutes les sauces
// la méthode app.use permet d'attribuer un middleware à une route spécifique de notre application
router.get('/', auth, saucesCtrl.getAllSauces);
// route pour lecture d'une seule sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
// route de modification/mise à jour
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// route de suppression
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// route de creation like des sauces
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// *multer permet de modifier nos middlewares (on modifie les routes POST et PUT)

module.exports = router;