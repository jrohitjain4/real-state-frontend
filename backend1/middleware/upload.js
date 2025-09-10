const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/profiles';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,uploadDir);
    },
    filename: function(req,file,cb) {
       const uniqueSuffix = Date.now() +'-'+ Math.round(Math.random() * 1E9);
       cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));

    }
    
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter
}); 

module.exports = upload;