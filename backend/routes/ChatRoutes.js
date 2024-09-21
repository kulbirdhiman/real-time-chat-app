import express from "express";
import { sendMessage ,getAllchats } from "../controller/messagecontrollers.js";
import { authTion  } from "../middlewares/autrazion.js";
const router = express.Router();

router.route("/:id").post(authTion, sendMessage);
router.route("/").get(authTion,getAllchats );

export default router;
