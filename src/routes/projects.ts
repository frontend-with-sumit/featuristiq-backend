import express, { Request, Response, Router } from "express";
import Project, { validateData } from "../models/Project";
import generateResponse from "../shared/utils/generateResponse";
import formatZodError from "../shared/utils/formatZodError";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	const projects = await Project.find({});
	res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: projects,
		})
	);
});

router.post("/", async (req: Request, res: Response) => {
	const result = validateData(req.body);

	// Validation Error
	if (!result.success) {
		const errors = formatZodError(result.error.issues);
		return res.status(400).send(
			generateResponse({
				requestType: "POST",
				responseType: "error",
				errors,
			})
		);
	}

	const { name, description } = req.body;
	const project = new Project({
		name,
		description,
	});

	await project.save();
	return res
		.status(200)
		.send(generateResponse({ requestType: "POST", responseType: "success" }));
});

export default router;
