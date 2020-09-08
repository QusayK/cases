const multer = require("multer");
const path = require("path");

module.exports = (type) => {
  const destination = type === "image" ? "assets/images" : "assets/attachments";

  const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
      const uniqueSuffix =
        new Date().toISOString().replace(/:/g, "-") +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

  const fileFilter = (req, file, cb) => {
    const fileTypes =
      type === "image"
        ? /jpeg|jpg|png|gif/
        : /jpeg|jpg|png|gif|pdf|txt|doc|docx|xls|xlsb|xlsm|xlsx/;

    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    else return cb("Error: File type selected not supported!");
  };

  return multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter,
  });
};
