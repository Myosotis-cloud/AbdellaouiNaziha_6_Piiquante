// -----import package Multer de npm pour form-data-------
const multer = require("multer");

// ------tableau des types d'extensions d'images acceptés------
const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
};

// création d'un objet de configuration de fichier MULTER/configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    // emplacement du fichier (destination dans le disque)
    destination: (req, file, callback) => {
        // appel de la callback
        callback(null,"images");
    },
    // déclaration du nom du fichier, de l'extension et de la date
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join ('_');
        const extension = MIME_TYPES[file.mimetype];
        // appel de la callback avec un timestamp Date.now() pour rendre notre fichier unique (conflit de même nom de fichier)
        callback(null, name + Date.now() + "." + extension);
    }
});

// export de notre middleware complètement configuré
// méthode single pour parler d'un seul fichier de type "image" uniquement
module.exports = multer({ storage: storage }).single('image');