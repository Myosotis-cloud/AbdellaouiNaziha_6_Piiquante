// import du plugin "validator"
const validator = require('validator');

// Création de la fonction de la validité de l'email
const isEmailValid = email => validator.isEmail(email);

// Export du module
module.exports = isEmailValid;