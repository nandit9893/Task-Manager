import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.fieldname}_${Date.now()}${file.originalname}`);
  },
});

export const upload = multer ({ storage: storage });