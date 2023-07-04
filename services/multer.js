const multer = require('multer');
const uuid = require('uuid');

// Configuration de Multer pour spécifier où enregistrer les fichiers
const mimeType = [
    'image/jpg',
    'image/jpeg',
    'image/png',
]
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Indique le dossier de destination des fichiers
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/")
        let extension = extArray[extArray.length - 1]
        // génère un UUID pour le nom du fichier
        cb(null, uuid.v4() + '.' + extension);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!mimeType.includes(file.mimetype)) {
            req.multerError = true
            return cb(null, false)
        } else {
            return cb(null, true)
        }
    }
});

module.exports = upload;