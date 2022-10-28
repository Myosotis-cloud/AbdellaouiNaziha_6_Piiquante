// import du plugin "password-validator"
const passwordValidator = require('password-validator');

// création du schéma de mot de passe
const schemaPassword = new passwordValidator();

// Propriétés du schéma de mot de passe
schemaPassword
.is().min(8)
.is().max(100)
.has().lowercase()
.has().uppercase(1)
.has().digits(2)
.has().symbols(1)
.has().not().spaces()
.is().not().oneOf(['Password', 'Password123']);

// Création de la fonction de validité du mot de passe

const isPasswordValid = password => (schemaPassword.validate(password));

// Création de la fonction retournant les messages de validation

const validationMessages = password => {
    
    let messages = '';
    
    const arr = schemaPassword.validate(password, { details: true })
    
    for (let i = 0; i < arr.length; i++) {
        messages += arr[i].message + " *** ";
    }
    
    return messages;
}

// Exports

module.exports = { isPasswordValid, validationMessages };