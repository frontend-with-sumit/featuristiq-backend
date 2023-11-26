import express from "express";

import { validateBody } from "../middlewares/validateBody";
import { validateData } from "../models/Flag";
import validateId from "../middlewares/validateId";

import {
	createFlag,
	deleteFlag,
	getFlagById,
	getFlags,
	updateFlag,
} from "../controllers/flag.controller";

const router = express.Router();

router.get("/", getFlags);

router.get("/:id", [validateId], getFlagById);

router.post("/", [validateBody(validateData)], createFlag);

router.patch("/:id", [validateId, validateBody(validateData)], updateFlag);

router.delete("/:id", [validateId], deleteFlag);

export default router;
