const jwt = require("jsonwebtoken");
// const dotenv = require('dotenv');
// dotenv.config();

// ---middleware de verification de validité du token-----
module.exports = (req, res, next) => {
    try {

        // --récupération du token dans bearer token---
        const token = req.headers.authorization.split(' ')[1];
        // La méthode  verify()  du package jsonwebtoken permet de vérifier la validité d'un token
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        // ---recupération du userId-------
        const userId = decodedToken.userId;
        // --ajout valeur userId à notre requête pour transmission à nos routes
        req.auth = { userId };

        if(req.body.userId && req.body.userId !== userId){
            throw "Invalid user ID";
        } else {
            next();
        }

    } catch {
        res.status(401).json({ 
            error: new Error ("Invalid request !"),
        });
    }
};