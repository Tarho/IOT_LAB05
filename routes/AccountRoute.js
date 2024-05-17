// AccountRoute.js
import express from "express";
import { login, register } from "../controller/AccountController.js";
import verifyJWT from "../verify.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
