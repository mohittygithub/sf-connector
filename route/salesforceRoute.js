import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createRecord,
  deleteRecord,
  findAll,
  updateRecord,
} from "../controller/salesforceController.js";

const router = express.Router();

router.post("/find-all", auth, findAll);
router.post("/create-record/:objectName", createRecord);
router.patch("/update-record/:objectName/:recordId", updateRecord);
router.delete("/delete-record/:objectName/:recordId", deleteRecord);

export default router;
