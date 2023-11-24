import express from "express";

import { getUser, registerUser } from "../controllers/user.controller";

import { validateBody } from "../middlewares/validateBody";
import auth from "../middlewares/auth";
import { validateData } from "../models/User";

const router = express.Router();

router.get("/me", [auth], getUser);

router.post("/register", [validateBody(validateData)], registerUser);

export default router;
