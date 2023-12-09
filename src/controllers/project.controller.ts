import { Request, Response } from "express";
import Project from "../models/Project";
import generateResponse from "../shared/utils/generateResponse";
import Flag from "../models/Flag";
import { CustomRequest } from "./user.controller";
import { validObjectId } from "../shared/utils/validObjectId";

/**
 * Get a list of all the projects created by the user
 */
export const getProjects = async (req: Request, res: Response) => {
	const projects = await Project.find({});
	res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: projects,
		})
	);
};

/**
 * Get a project based on the id.
 * If the project is not found, return 404 error
 */
export const getProjectById = async (req: Request, res: Response) => {
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
};

/**
 * Creates a new project
 * Request body should contain 'name' and 'description'
 */
export const createProject = async (req: CustomRequest, res: Response) => {
	const { name, description } = req.body;
	const project = new Project({
		name,
		description,
		created_by: req?.user?._id,
	});
	await project.save();

	return res.status(200).send(
		generateResponse({
			requestType: "POST",
			responseType: "success",
			items: project,
		})
	);
};

/**
 * Update a project based on the id
 * If the project is not found, return 404 error
 * Request body can either contain name, description or both
 */
export const updateProject = async (req: Request, res: Response) => {
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
				generateResponse({ requestType: "PATCH_1", responseType: "error" })
			);

	return res.status(200).send(
		generateResponse({
			requestType: "PATCH",
			responseType: "success",
			items: project,
		})
	);
};

/**
 * Collaborators are users who can work on the flags in the
 * project
 * Accepts an array of user ids, if empty array is passed,
 * it will remove all the collaborators from the project
 */
export const updateCollaborators = async (req: Request, res: Response) => {
	const { collaborators } = req.body;

	if (collaborators?.length) {
		const validCollaborators = collaborators.every((collaborator: string) =>
			validObjectId(collaborator)
		);

		if (!validCollaborators)
			return res.status(400).send(
				generateResponse({
					requestType: "OTHER",
					responseType: "error",
					code: 400,
					message: "Invalid user ids",
				})
			);
	}

	const project = await Project.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				collaborators: [...new Set(collaborators)],
			},
		},
		{ new: true }
	);

	if (!project)
		return res
			.status(404)
			.send(
				generateResponse({ requestType: "PATCH_1", responseType: "error" })
			);

	return res.status(200).send(
		generateResponse({
			requestType: "PATCH",
			responseType: "success",
			items: project,
		})
	);
};

/**
 * Delete a project based on the id
 * If the project is not found, return 404 error
 */
export const deleteProject = async (req: Request, res: Response) => {
	const project = await Project.deleteOne({ _id: req.params.id });

	if (!project)
		return res
			.status(404)
			.send(generateResponse({ requestType: "DELETE", responseType: "error" }));

	return res.status(200).send(
		generateResponse({
			requestType: "DELETE",
			responseType: "success",
			items: project,
		})
	);
};
