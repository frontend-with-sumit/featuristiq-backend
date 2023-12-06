import { Request, Response } from "express";
import Project from "../models/Project";
import generateResponse from "../shared/utils/generateResponse";
import Flag from "../models/Flag";

/**
 * Get a list of all the projects created by the user
 */
const getProjects = async (req: Request, res: Response) => {
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
const getProjectById = async (req: Request, res: Response) => {
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
const createProject = async (req: Request, res: Response) => {
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
};

/**
 * Update a project based on the id
 * If the project is not found, return 404 error
 * Request body can either contain name, description or both
 */
const updateProject = async (req: Request, res: Response) => {
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
 * Delete a project based on the id
 * If the project is not found, return 404 error
 */
const deleteProject = async (req: Request, res: Response) => {
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

export {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
};
