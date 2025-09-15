const multer = require('multer');
const path = require('path');
const fs = require('fs');

const kycUploadDir = 'uploads/kyc';
if (!fs.existsSync(kycUploadDir)) {
    fs.mkdirSync(kycUploadDir, { recursive: true });
}


const kycStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, kycUploadDir);
    },
    filename: function(req, file, cb) {
        const docType = req.body.documentType || 'document';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${docType}-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});


const uploadKYC = multer({
    storage: kycStorage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed!'));
        }
    }
});

module.exports = uploadKYC;
