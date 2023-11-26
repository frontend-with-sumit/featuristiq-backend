import { Request, Response } from "express";

import Flag from "../models/Flag";
import Project from "../models/Project";
import Envs from "../models/Env";

import { CustomRequest } from "./user.controller";

import generateResponse from "../shared/utils/generateResponse";
import { validObjectId } from "../shared/utils/validObjectId";

const getFlags = async (req: Request, res: Response) => {
	const flags = await Flag.find({});

	return res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: flags,
		})
	);
};

const getFlagById = async (req: Request, res: Response) => {
	const flag = await Flag.findById(req.params.id);
	if (!flag)
		return res
			.status(400)
			.send(generateResponse({ requestType: "GET", responseType: "error" }));

	res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: flag,
		})
	);
};

/**
 * While creating a flag, perform the following operations:
 * 1. If the envs exists, validate it with project environments
 * 2. Validate project id for format, then verify if there exists any project with project id
 */
const createFlag = async (req: CustomRequest, res: Response) => {
	const { name, description, envs, project_id } = req.body;

	// Validating environments
	if (envs?.length) {
		const projectEnvs = await Envs.find({ projectId: project_id });

		const availableEnvNames = projectEnvs.map((env) => env?.name);
		const validEnvs = envs.every((env: string) =>
			availableEnvNames.includes(env)
		);
		if (!validEnvs)
			return res.status(400).send(
				generateResponse({
					requestType: "OTHER",
					responseType: "error",
					code: 400,
					message: `Please select valid environments. Available environments - ${availableEnvNames.join(
						", "
					)}`,
				})
			);
	}

	// Validating project id
	if (!validObjectId(project_id))
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Invalid project id",
			})
		);

	const project = await Project.findById(project_id);
	if (!project)
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Invalid project id",
			})
		);

	const newFlag = new Flag({
		name,
		description,
		envs,
		project_id,
		created_by: req?.user?._id,
	});

	await newFlag.save();

	res.status(200).send(
		generateResponse({
			requestType: "POST",
			responseType: "success",
			items: newFlag,
		})
	);
};

const updateFlag = async (req: CustomRequest, res: Response) => {
	const { name, description, envs, project_id } = req.body;

	// Validating environments
	if (envs?.length) {
		const projectEnvs = await Envs.find({ project_id });

		const availableEnvNames = projectEnvs.map((env) => env?.name);
		const validEnvs = envs.every((env: string) =>
			availableEnvNames.includes(env)
		);
		if (!validEnvs)
			return res.status(400).send(
				generateResponse({
					requestType: "OTHER",
					responseType: "error",
					code: 400,
					message: `Please select valid environments. Available environments - ${availableEnvNames.join(
						", "
					)}`,
				})
			);
	}

	// Validating project id
	if (project_id) {
		// If project_id is not valid, return 400
		if (!validObjectId(project_id))
			return res.status(400).send(
				generateResponse({
					requestType: "OTHER",
					responseType: "error",
					code: 400,
					message: "Invalid project id format",
				})
			);

		// If no project found with project_id, return 400
		const project = await Project.findById(project_id);
		if (!project)
			return res.status(400).send(
				generateResponse({
					requestType: "OTHER",
					responseType: "error",
					code: 400,
					message: "Invalid project id",
				})
			);
	}

	const flag = await Flag.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				name,
				description,
				envs,
				project_id,
				created_by: req?.user?._id,
			},
		},
		{ new: true }
	);

	if (!flag)
		return res
			.status(404)
			.send(
				generateResponse({ requestType: "PATCH_1", responseType: "error" })
			);

	res.status(200).send(
		generateResponse({
			requestType: "PATCH",
			responseType: "success",
			items: flag,
		})
	);
};

const deleteFlag = async (req: Request, res: Response) => {
	const flag = await Flag.findOneAndDelete({ _id: req.params.id });
	if (!flag)
		return res
			.status(400)
			.send(generateResponse({ requestType: "DELETE", responseType: "error" }));

	res
		.status(200)
		.send(generateResponse({ requestType: "DELETE", responseType: "success" }));
};

export { getFlags, getFlagById, createFlag, updateFlag, deleteFlag };
