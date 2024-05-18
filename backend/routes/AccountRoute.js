// AccountRoute.js
import express from "express";
import {getAccountById, getAllAccounts, login, register } from "../controller/AccountController.js";
import verifyJWT from "../verify.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getallacc", getAllAccounts);
router.get("/getAccountByID/:id",getAccountById );

export default router;
