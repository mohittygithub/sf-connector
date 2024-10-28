import experss from "express";
import {
  deleteUser,
  findAllUsers,
  findUserById,
  login,
  register,
  updateUser,
} from "../controller/userController.js";
import { auth, admin } from "../middleware/auth.js";
import { addJwtToBlacklist } from "../controller/blackListJwtController.js";

const router = experss.Router();

router.post("/login", login);
router.post("/logout", auth, addJwtToBlacklist);
router.post("/register", register);
router.get("/", auth, admin, findAllUsers);
router.get("/:userId", auth, findUserById);
router.put("/:userId", auth, updateUser);
router.delete("/:userId", admin, deleteUser);

export default router;
