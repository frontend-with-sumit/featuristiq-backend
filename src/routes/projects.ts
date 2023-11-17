import express, { Request, Response, Router } from "express";
import Project, { validateData } from "../models/Project";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	const projects = await Project.find({});
	res.status(200).send(projects);
});

router.post("/", async (req: Request, res: Response) => {
	const result = validateData(req.body);

	if (!result.success) {
		const formatted = result.error.format();
		console.log(formatted);
		return res.status(400).send("BAD_REQUEST");
	}

	const { name, description } = req.body;
	const project = new Project({
		name,
		description,
	});

	const response = await project.save();

	return res.status(200).send(response);
});

export default router;
