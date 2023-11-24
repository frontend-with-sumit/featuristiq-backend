import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

interface Project extends Document {
	name: string;
	description?: string;
}

const projectSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
	},
	{ versionKey: false }
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
