import experss from "express";
import { login, register } from "../controller/userController.js";

const router = experss.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
