import express from "express";
import { login } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validateBody";
import { validateData } from "../models/Auth";

const router = express.Router();

router.post("/", [validateBody(validateData)], login);

export default router;
