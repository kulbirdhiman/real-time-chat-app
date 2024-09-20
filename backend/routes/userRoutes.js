import express from 'express';
import {allUser, signUp , loginUser ,logout} from '../controller/userControllers.js'
const router = express.Router();

router.route("/").post(signUp).get(allUser);
router.route("/login").post(loginUser)
router.route("/logout").post(logout)
export default router