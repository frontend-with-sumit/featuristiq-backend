import { Request, Response } from "express";
import mongoose from "mongoose";
import Envs from "../models/Env";
import generateResponse from "../shared/utils/generateResponse";

/**
 * Get a list of all the envs created by the user
 */
const getEnvs = async (req: Request, res: Response) => {
	// If query params contains the projectId then fetch the environments
	// based on the projectId else fetch all environments
	if (req.query?.projectId) return getEnvByProjectId(req, res);

	const envs = await Envs.find({});
	return res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: envs,
		})
	);
};

/**
 * Get an env based on the id.
 * If the env is not found, return 404 error
 */
const getEnvById = async (req: Request, res: Response) => {
	const envs = await Envs.findById(req.params.id);

	if (!envs)
		return res
			.status(404)
			.send(generateResponse({ requestType: "GET", responseType: "error" }));

	return res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: envs,
		})
	);
};

/**
 * Get all environments based on the project id preset in queryParams.
 * If the environments are not found, return 404 error
 */
const getEnvByProjectId = async (req: Request, res: Response) => {
	const id = req.query.projectId?.toString();

	if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Invalid ID format",
			})
		);
	}

	const projectId = mongoose.Types.ObjectId.createFromHexString(id);
	const envs = await Envs.find({ projectId });

	if (!envs.length)
		return res
			.status(404)
			.send(generateResponse({ requestType: "GET", responseType: "error" }));

	return res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: envs,
		})
	);
};

/**
 * Creates a new env
 * Request body should contain 'name' and 'url'
 */
const createEnv = async (req: Request, res: Response) => {
	const { name, url, projectId } = req.body;
	const env = new Envs({
		name,
		url,
		projectId,
	});
	await env.save();

	return res.status(200).send(
		generateResponse({
			requestType: "POST",
			responseType: "success",
			items: env,
		})
	);
};

/**
 * Update an env based on the id
 * If the env is not found, return 404 error
 * Request body can either contain name, url or both
 */
const updateEnv = async (req: Request, res: Response) => {
	const { name, url } = req.body;
	const env = await Envs.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				name,
				url,
			},
		},
		{ new: true }
	);

	if (!env)
		return res
			.status(404)
			.send(
				generateResponse({ requestType: "PATCH_1", responseType: "error" })
			);

	return res.status(200).send(
		generateResponse({
			requestType: "PATCH",
			responseType: "success",
			items: env,
		})
	);
};

/**
 * Delete an env based on the id
 * If the env is not found, return 404 error
 */
const deleteEnv = async (req: Request, res: Response) => {
	const env = await Envs.findByIdAndDelete(req.params.id);

	if (!env)
		return res
			.status(404)
			.send(generateResponse({ requestType: "DELETE", responseType: "error" }));

	return res.status(200).send(
		generateResponse({
			requestType: "DELETE",
			responseType: "success",
			items: env,
		})
	);
};

export {
	getEnvs,
	getEnvById,
	getEnvByProjectId,
	createEnv,
	updateEnv,
	deleteEnv,
};
