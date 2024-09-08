import { Router } from "express";
import { auth } from "../middleware/auth";

// Routes import
const workspace = require("./workspace");
const chat = require("./chat");

// Router initialization
const root: Router = Router();

root.use("/workspaces", workspace);
root.use("", auth, chat);

export default root;
