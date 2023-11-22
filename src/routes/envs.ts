import express, { Router } from "express";
import { validateData } from "../models/Env";
import validateObjectId from "../middlewares/validateId";
import { validateBody } from "../middlewares/validateBody";

import {
	createEnv,
	deleteEnv,
	getEnvById,
	getEnvs,
	updateEnv,
} from "../controllers/envs.controller";

const router: Router = express.Router();

router.get("/", getEnvs);

router.get("/:id", [validateObjectId], getEnvById);

router.post("/", [validateBody(validateData)], createEnv);

router.patch("/:id", [validateObjectId, validateBody(validateData)], updateEnv);

router.delete("/:id", [validateObjectId], deleteEnv);

export default router;
