import { Router } from "express";

// Routes import
const workspace = require("./workspace");

// Router initialization
const root: Router = Router();

root.use("/workspaces", workspace);

export default root;
