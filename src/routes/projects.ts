import express, { Router } from "express";
import { validateData } from "../models/Project";
import validateObjectId from "../middlewares/validateId";
import { validateBody } from "../middlewares/validateBody";

import {
	createProject,
	deleteProject,
	getProjectById,
	getProjects,
	updateCollaborators,
	updateProject,
} from "../controllers/project.controller";

const router: Router = express.Router();

router.get("/", getProjects);

router.get("/:id", [validateObjectId], getProjectById);

router.post("/", [validateBody(validateData)], createProject);

router.patch(
	"/:id",
	[validateObjectId, validateBody(validateData)],
	updateProject
);

router.patch(
	"/:id/editCollaborators",
	[validateObjectId, validateBody(validateData)],
	updateCollaborators
);

router.delete("/:id", [validateObjectId], deleteProject);

export default router;
