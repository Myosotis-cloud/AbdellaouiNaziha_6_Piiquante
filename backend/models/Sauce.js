//  ----------- import de mongoose-------------
const mongoose = require ('mongoose'); 

//  ----------- création schéma ------------
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    mainPepper: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},

    // ----modèle des likes et dislikes-------
    likes: {type: Number, default:0},
    dislikes: {type: Number, default:0},
    usersLiked: {type: [String], default:[]},
    usersDisliked: {type: [String], default:[]}
});

//  ------------modele pour exploiter notre schéma - exporter le module-------------
module.exports = mongoose.model('Sauce', sauceSchema);