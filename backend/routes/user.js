const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// création des routes d'authentification
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;