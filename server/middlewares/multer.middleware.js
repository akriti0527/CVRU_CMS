import multer from "multer";
import path from "path";



// ======================================
// MULTER STORAGE
// ======================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  }
});



// ======================================
// FILE FILTER
// ======================================

const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpg|jpeg|png|webp/;

  const extName =
    allowedTypes.test(
      path.extname(file.originalname)
      .toLowerCase()
    );

  const mimeType =
    allowedTypes.test(file.mimetype);

  if (extName && mimeType) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only images are allowed"
      )
    );
  }
};



// ======================================
// MULTER UPLOAD
// ======================================

export const upload = multer({

  storage,

  fileFilter
});