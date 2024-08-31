import { Router } from "express";

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getAllWorkspaces,
} from "controller/workspace";
const router = Router();

router.post("/workspace", createWorkspace);
router.delete("/workspace/:id", deleteWorkspace);
router.get("/workspace/:id", getWorkspace);
router.get("/workspaces", getAllWorkspaces);

export default router;
