import express from "express";

import {
	createEnv,
	deleteEnv,
	getEnvById,
	getEnvs,
	updateEnv,
} from "../controllers/envs.controller";

import validateObjectId from "../middlewares/validateId";
import { validateBody } from "../middlewares/validateBody";
import { validateData } from "../models/Env";

const router = express.Router();

router.get("/", getEnvs);

router.get("/:id", [validateObjectId], getEnvById);

router.post("/", [validateBody(validateData)], createEnv);

router.patch("/:id", [validateObjectId, validateBody(validateData)], updateEnv);

router.delete("/:id", [validateObjectId], deleteEnv);

export default router;
