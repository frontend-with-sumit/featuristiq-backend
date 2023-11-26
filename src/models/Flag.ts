import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export interface IFlag extends Document {
	name: string;
	description?: string;
	envs?: string[] | [];
	created_by: string;
	project_id: string;
}

const flagSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		envs: { type: Array, default: [] },
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			trim: true,
		},
		project_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const Flag = mongoose.model<IFlag>("flag", flagSchema);

const flagValidationSchema = z.object({
	name: z.string({ required_error: "Name is required" }).min(5).max(255).trim(),
	description: z.string().min(5).max(255).trim().optional(),
	envs: z.string().array().min(0).optional(),
	project_id: z.string().trim(),
});

/**
 * Validate the request body as per the schema rules.
 * ```type``` is important, based on that different validation rules are applied on the data
 * @param data - Request body
 * @param type - Request type, can be either POST or PATCH
 * @returns zod safeParse object
 */
const validateData = (
	data: z.infer<typeof flagValidationSchema>,
	type: "POST" | "PATCH"
) =>
	(type === "POST"
		? flagValidationSchema
		: flagValidationSchema.partial()
	).safeParse(data);

export { validateData };
export default Flag;
