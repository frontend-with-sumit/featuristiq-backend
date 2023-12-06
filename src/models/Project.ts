import { NextFunction } from "express";
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";
import Flag from "./Flag";
import Envs from "./Env";

interface Project extends Document {
	name: string;
	description?: string;
}

const projectSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
	},
	{
		versionKey: false,
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

/**
 * If a project is deleted then all the related flags and environments
 * should also be deleted
 */
projectSchema.post(
	"deleteOne",
	{ query: true, document: false },
	async function () {
		await Flag.deleteMany({ project_id: this.getQuery()._id }).exec();
		await Envs.deleteMany({ project_id: this.getQuery()._id }).exec();
	}
);

const Project = mongoose.model<Project>("Project", projectSchema);

const projectValidationSchema = z.object({
	name: z.string({ required_error: "Name is required" }).min(5).max(255).trim(),
	description: z.string().min(5).max(255).trim().optional(),
});

/**
 * Validate the request body as per the schema rules.
 * ```type``` is important, based on that different validation rules are applied on the data
 * @param data - Request body
 * @param type - Request type, can be either POST or PATCH
 * @returns zod safeParse object
 */
const validateData = (
	data: z.infer<typeof projectValidationSchema>,
	type: "POST" | "PATCH"
) =>
	(type === "POST"
		? projectValidationSchema
		: projectValidationSchema.partial()
	).safeParse(data);

export { validateData };
export default Project;
