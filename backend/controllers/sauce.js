const sauceModel = require('../models/Sauce');
const fs = require("fs");


// -------Afficher ttes les sauces---------------------------------
exports.getAllSauces = (req, res, next) => {
    sauceModel.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) =>{
            res.status(400).json({message:error.message});
        });

    console.log("affichage de toutes les sauces réussie, bravo !");
};
// -------Fin : affichage de toutes les sauces (GET)------------------

// --------création d'une nouvelle sauce-----------------------
exports.createSauce = (req, res, next) => {
    // parser l'objet requête qui est renvoyé en string
    const sauceObject = JSON.parse(req.body.sauce);
   // suppression du champ _id car il sera généré automatiquemet par la BDD 
    delete sauceObject._id;
   // suppression du champ userId car nous ne voulons pas faire confiance au user pour des raisons de sécurité    
    // delete sauceObject._userId;
   // création de notre nouvel objet moins les 2 champs supprimés   
    const sauce = new sauceModel({
        ...sauceObject,
        // récupérer le userId de la BDD (middleware auth)
        // userId: req.auth._userId,
        // générer l'Url grâce à des propriétés de l'objet requête car nous n'avons que le nom du fichier donné par multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // likes: 0,
        // dislikes: 0,
        // usersLiked: [],
        // usersDisliked: []
    });
    console.log(sauce);
   //sauvegarde de l'objet dans la BDD
    sauce.save()
        .then((sauce) => {
            res.status(201).json({ message: 'Sauce créé et enregistrée avec succès, bravo !' });
        })
        .catch((error) => {
            res.status(400).json({  message :error.message });
        });
};
// --------Fin: création sauce (POST)--------------------------

// --------------------------afficher qu'une seule sauce----------------------------------
exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(400).json({ message :error.message});
        });
};
// --------------------------Fin: affichage sauce spécifique GET:One-----------------------

// -----------------------------------modifier une sauce-----------------------------------
exports.modifySauce = (req, res, next) => {
    // recupérer l'objet en vérifiant s'il y a un champs file
    const sauceObject = req.file ? //---s'il y a un fichier {oui traiter l'image}:{non traiter l'objet}
    {
        // parser la chaîne de caractères
        ...JSON.parse(req.body.sauce),
        // recréer l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // sinon récupérer l'objet dans le corps de la requête
    } : { ...req.body };
                // si c'est le bon utilisateur : mettre à jour l'enregistrement
                sauceModel.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => {
                        res.status(200).json({message: 'Votre sauce a été modifiée avec succès, bravo !'});
                    })
                    .catch((error) => {
                        res.status(400).json({  message :error.message });
                    });
};
// ------------------------------------Fin: modifier une sauce-----------------------------

// -----------------------supprimer un objet "sauce"-----------------------------------------
exports.deleteSauce = (req, res, next) => {
    // -----récupérer l'objet en base------
    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            //supprimer le fichier de notre BDD et l'image du systeme de fichiers
            // récupération de l'url enregistré et recréer le chemin du système de fichiers à partir de celui-ci
            fs.unlink(`images/${filename}`, () => {
                sauceModel.deleteOne({ _id: req.params.id })
                    .then(() => 
                        res.status(200).json({ message: "Votre sauce a bien été supprimée avec succès !" })
                    )
                    .catch ((error) => {
                        res.status(400).json({  message :error.message })
                    });
            });
        })
        .catch((error) => 
            res.status(500).json({ message : "une erreur de serveur est survenue !" })
        );
};
// --------------Fin: suppression d'un objet "sauce"-----------------------------------------       

// --------------Option de likes-----------------------
exports.likeSauce = (req, res, next) => {
    switch(req.body.like) {
        case 0:
            sauceModel.findOne({ _id: req.params.id })
                .then((sauce) => {
                    //---like = 0 (like neutre = 0, je retire mon like)------
                    if(sauce.usersLiked.includes(req.auth.userId)){
                        console.log("--> UserId est dans le userLiked ET like = 0");
                    // --mise à jour de l'objet dans la BDD MongoDB Atlas--
                        sauceModel.updateOne(
                            { _id: req.params.id },
                            {
                            // ---operateur $inc incrémente un champ dans la BDD d'une valeur spécifiée, si le champ n'existe pas, $inc crée le champ et définit le champ sur la valeur spécifiée---
                                $inc:{ likes: -1 }, // --{$inc: { champ: valeur1, champ: valeur2, ...}}
                                $pull:{ usersLiked: req.auth.userId }, // --- {$pull: {champ: valeur1|condition, champ2: valeur2|condition2, ...}} --cet operateur va retirer une valeur existante dans un array ---
                                _id: req.params.id,
                            }
                        )
                        .then(() => {
                            res.status(201).json({ message: 'Votre vote a bien été retiré ! (like 0)'});
                        })
                        .catch((error) => {
                            res.status(400).json({  message :error.message });
                        });
                    }

                    // -------like = 0 (dislike = 0)---je retire mon dislike-----
                    if (sauce.usersDisliked.includes(req.auth.userId)) {
                        console.log("--> UserId est dans le usersDisliked ET dislikes = 0");
                        // --mise à jour de l'objet dans la BDD MongoDB Atlas--
                        sauceModel.updateOne(
                            { _id: req.params.id },
                            {
                                // ---operateur $inc incrémente un champ dans la BDD d'une valeur spécifiée, si le champ n'existe pas, $inc crée le champ et définit le champ sur la valeur spécifiée---
                                $inc:{ dislikes: -1 }, // --{$inc: { champ: valeur1, champ: valeur2, ...}}
                                $pull:{ usersDisliked: req.auth.userId }, // --- {$pull: {champ: valeur1|condition, champ2: valeur2|condition2, ...}} --cet operateur va retirer une valeur existante dans un array ---
                                _id: req.params.id,
                            }
                        )

                        .then(() => {
                            res.status(201).json({ 
                                message: 'Votre dislike a bien été retiré, merci pour votre vote ! (dislikes = 0)'
                            });
                        })
                        .catch((error) => {
                            res.status(400).json({  message :error.message });
                        });
                    }
                })
            
                .catch((error) => {
                    res.status(404).json({  message :error.message });
                });
            break;

        // --- case 1 --> like = +1 ---
        case 1 :
            // --mise à jour de l'objet dans la BDD MongoDB Atlas--
            sauceModel.updateOne(
                { _id: req.params.id },
                {
                    // ---operateur $inc incrémente un champ dans la BDD d'une valeur spécifiée, si le champ n'existe pas, $inc crée le champ et définit le champ sur la valeur spécifiée---
                    $inc: { likes: 1 }, // --{$inc: { champ: valeur1, champ: valeur2, ...}}
                    $push: { usersLiked: req.auth.userId }, // --- operateur qui va pousser le +1 dans la BDD MongoDB--
                    _id: req.params.id,
                }
            )

                .then(() => {
                    res.status(201).json({ message: 'Vous aimez cette sauce, merci pour votre vote ! (like +1)'});
                })
                .catch((error) => {
                    res.status(400).json({  message :error.message });
                });
            break;

        case -1 : 
            //--- dislikes = +1 (likes = -1) ---
            // --- mise à jour de l'objet dans la BDD MongoDB Atlas ---
            sauceModel.updateOne(
                {_id: req.params.id},
                {
                // ---operateur $inc incrémente un champ dans la BDD d'une valeur spécifiée, si le champ n'existe pas, $inc crée le champ et définit le champ sur la valeur spécifiée---
                    $inc:{dislikes: 1}, // --{$inc: { champ: valeur1, champ: valeur2, ...}}
                    $push:{ usersDisliked: req.auth.userId }, // --- {$pull: {champ: valeur1|condition, champ2: valeur2|condition2, ...}} --cet operateur va retirer une valeur existante dans un array ---
                    _id: req.params.id,
                }
            )
                .then(() => {
                    res.status(201).json({ message: 'Vous avez disliké cette sauce, votre vote a bien été pris en compte, merci ! (dislike +1)'});
                })
                .catch((error) => {
                    res.status(400).json({  message :error.message });
                });
            break;

            default:
                    console.error("mauvaise requête !");
        }
    // ---- FIN : switch ----
};

// ------------------------ FIN : route likeSauce -------------------------