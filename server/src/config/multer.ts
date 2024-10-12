// const path = require("path");
// import { Request } from "express";
import multer from "multer";

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow all file types
  cb(null, true);

  // Alternatively, if you want to restrict to specific file types:
  // const allowedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
  // const ext = path.extname(file.originalname).toLowerCase();
  // if (allowedFileTypes.includes(ext)) {
  //   cb(null, true);
  // } else {
  //   cb(new Error('Invalid file type. Allowed types are: ' + allowedFileTypes.join(', ')));
  // }
};

// Configure Multer
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: fileFilter,
});
