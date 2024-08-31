import { Router } from "express";

// Routes import
import auth from "./auth";

// Router initialization
const root: Router = Router();

root.use("/auth", auth);

export default root;
