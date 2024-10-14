const router = require("express").Router();
import { auth } from "../middleware/auth";
import { upload } from "../config/multer";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getAllWorkspaces,
  attachFile,
  deleteFile,
} from "../controller/workspace";

router.post("/create", auth, createWorkspace);
router.delete("/:id", auth, deleteWorkspace);
router.get("/:id", auth, getWorkspace);
router.get("", auth, getAllWorkspaces);

// Upload file

router.post("/upload", upload.array("files", 10), auth, attachFile);
router.delete("/:id/files/:fileId", auth, deleteFile);

module.exports = router;
