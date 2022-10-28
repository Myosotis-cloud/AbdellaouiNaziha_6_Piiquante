// ---import du Package de cryptage bcrypt ----
const bcrypt = require('bcrypt');
// -----import du Package jasonwebtoken ------
const jwt = require('jsonwebtoken');
// -----import schéma user------------
const UserModel = require('../models/User');
//  ----import schéma email/password validator -----
const isEmailValid = require('../utils/emailValid');
const { isPasswordValid, validationMessages } = require('../utils/passwordValid');

// ----------------------Middlewares d'Authentification (début) -----------------------
// ------méthode signup-------------
exports.signup = (req, res, next) => {
    // Vérification de la validité de l'email
    if (!isEmailValid(req.body.email)) {
        return res.status(400).json({
            message: 'adresse email non valide !'
        });
    };

    // Vérification de la validité du mot de passe
    if (!isPasswordValid(req.body.password)) {

        return res.status(400).json({
            message: validationMessages(req.body.password)
        });
    };

    // -----hachage/cryptage du mdp avec fonction asynchrone------
    bcrypt
        .hash(req.body.password, 10) //--- 10 correspond au nombre de fois que l'algorythme va haché ---
        .then(hash => {
            // ---création nouveau utilisateur avec mdp crypté -----
            const user = new UserModel({
                email: req.body.email,
                password: hash
            });
            // ---enregistrement du nouvel utilisateur dans la BDD-----
            user
                .save()
                .then(() => 
                    res.status(201).json({message : "Votre compte a été créé avec succès, bravo !"})
                )
                .catch(error => 
                    res.status(400).json({ message :error.message  })
                );
        })

        .catch(error => 
            res.status(500).json({  message :error.message })
        );
};
// ------fin méthode signup-----------


// -----méthode login------
exports.login = (req, res, next) => {
    UserModel.findOne ({email: req.body.email})
        .then(user => {
            // password et identifiant inexistants dans la BDD
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé !'});

            }
            // verification du mot de passe par comparaison
                bcrypt
                    .compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(400).json({ message: 'Mot de passe incorrect !'});
                        }
                        res.status(200).json({
                            userId: user._id,
                            // Signature du token - méthode sign utilise une clé secrète pour chiffrer un token
                            token: jwt.sign(
                                // données encodées/chiffrés pour autoriser l'authentification
                                {userId : user._id },
                                // clé secrète pour l'encodage
                                'RANDOM_TOKEN_SECRET',
                                {expiresIn: '24h'}
                            ),
                        });
                    })
                    .catch(error =>
                        res.status(500).json({  message :error.message })
                    );
        })
        .catch(error => 
            res.status(500).json({ message :error.message})
        );
};
// ---------- (fin) Middleware d'authentification) ------------