import { Router } from "express";

// Routes import
// import auth from "./auth";
const workspace = require("./workspace");

// Router initialization
const root: Router = Router();

// root.use("/auth", auth);
root.use("/workspaces", workspace);

export default root;
