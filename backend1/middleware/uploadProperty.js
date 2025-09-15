// middleware/uploadProperty.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directory if not exists
const propertyUploadDir = 'uploads/properties';
if (!fs.existsSync(propertyUploadDir)) {
    fs.mkdirSync(propertyUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, propertyUploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `property-${req.params.propertyId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'), false);
    }
};

const uploadProperty = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB per file
        files: 10 // Maximum 10 files
    },
    fileFilter: fileFilter
});

module.exports = uploadProperty;