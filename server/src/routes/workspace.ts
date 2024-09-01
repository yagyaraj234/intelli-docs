const router = require("express").Router();

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getAllWorkspaces,
} from "../controller/workspace";

router.post("/create", createWorkspace);
router.delete("/:id", deleteWorkspace);
router.get("/:id", getWorkspace);
router.get("", getAllWorkspaces);

module.exports = router;
