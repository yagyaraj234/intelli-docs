"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const auth_1 = require("../middleware/auth");
const workspace_1 = require("../controller/workspace");
router.post("/create", auth_1.auth, workspace_1.createWorkspace);
router.delete("/:id", auth_1.auth, workspace_1.deleteWorkspace);
router.get("/:id", auth_1.auth, workspace_1.getWorkspace);
router.get("", auth_1.auth, workspace_1.getAllWorkspaces);
// temporary workspace
router.get("/create_temporary_chat", workspace_1.temporaryWorkspace);
module.exports = router;
