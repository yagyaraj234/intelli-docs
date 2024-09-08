const router = require("express").Router();
import {auth} from '../middleware/auth'
import { upload } from '../config/multer';
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getAllWorkspaces,
  temporaryWorkspace,
  attachFile
} from "../controller/workspace";

router.post("/create",auth,createWorkspace);
router.delete("/:id",auth, deleteWorkspace);
router.get("/:id",auth, getWorkspace);
router.get("",auth, getAllWorkspaces);


// Upload file

router.post("/upload",upload.array('files'),attachFile)

// temporary workspace
router.get("/create_temporary_chat", temporaryWorkspace);

module.exports = router;
