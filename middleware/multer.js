const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // To prevent duplicate filenames
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueSuffix + fileExtension
    
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  // fileFilter: (req, file, cb) => {
  //   const allowed = ["image/png", "image/jpeg", "application/pdf"];
  //   if (allowed.includes(file.mimetype)) cb(null, true);
  //   else cb(new Error("Invalid file type"));
  // }
});

module.exports = upload;