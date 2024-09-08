const router = require("express").Router();
import { generate, updateChat } from "../controller/chat";

router.post("/chat", generate);
router.patch("/updateChat", updateChat);

module.exports = router;
