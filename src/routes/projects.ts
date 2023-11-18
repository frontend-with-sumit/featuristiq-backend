import express, { Request, Response, Router } from "express";
import Project, { validateData } from "../models/Project";
import generateResponse from "../shared/utils/generateResponse";
import formatZodError from "../shared/utils/formatZodError";
import validateObjectId from "../middlewares/validateId";

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

router.get("/:id", [validateObjectId], async (req: Request, res: Response) => {
	const project = await Project.findById({ _id: req.params.id });

	if (!project)
		return res.status(404).send(
			generateResponse({
				requestType: "GET",
				responseType: "error",
			})
		);

	return res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: project,
		})
	);
});

router.post("/", async (req: Request, res: Response) => {
	const validData = validateData(req.body, "POST");

	// Validation Error
	if (!validData.success) {
		const errors = formatZodError(validData.error.issues);
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

	return res.status(200).send(
		generateResponse({
			requestType: "POST",
			responseType: "success",
			items: project,
		})
	);
});

router.patch(
	"/:id",
	[validateObjectId],
	async (req: Request, res: Response) => {
		const validData = validateData(req.body, "PATCH");
		if (!validData.success) {
			const errors = formatZodError(validData.error.issues);
			return res.status(400).send(
				generateResponse({
					requestType: "PATCH_1",
					responseType: "error",
					errors,
				})
			);
		}

		const { name, description } = req.body;
		const project = await Project.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					name,
					description,
				},
			},
			{ new: true }
		);

		if (!project)
			return res
				.status(404)
				.send(
					generateResponse({ requestType: "PATCH_2", responseType: "error" })
				);

		return res.status(200).send(
			generateResponse({
				requestType: "PATCH",
				responseType: "success",
				items: project,
			})
		);
	}
);

router.delete(
	"/:id",
	[validateObjectId],
	async (req: Request, res: Response) => {
		const project = await Project.findByIdAndDelete(req.params.id);
		console.log(project);
		if (!project)
			return res
				.status(404)
				.send(
					generateResponse({ requestType: "DELETE", responseType: "error" })
				);

		return res.status(200).send(
			generateResponse({
				requestType: "DELETE",
				responseType: "success",
				items: project,
			})
		);
	}
);

export default router;
