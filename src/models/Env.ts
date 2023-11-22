import mongoose, { Schema } from "mongoose";
import { z } from "zod";

interface Env extends Document {
	name: string;
	url: string;
	projectId: string;
}

const envSchema = new Schema(
	{
		name: { type: String, required: true },
		url: { type: String, required: true },
		projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
	},
	{ versionKey: false }
);

const Envs = mongoose.model<Env>("env", envSchema);

const envValidationSchema = z.object({
	name: z.string({ required_error: "Name is required" }).max(50),
	url: z
		.string({ required_error: "URL is required" })
		.url({ message: "Invalid URL" })
		.max(255),
	projectId: z
		.string({ required_error: "A valid project id is required" })
		.refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
			message: "Invalid project id format",
		}),
});

/**
 * Validate the request body as per the schema rules.
 * ```type``` is important, based on that different validation rules are applied on the data
 * @param data - Request body
 * @param type - Request type, can be either POST or PATCH
 * @returns zod safeParse object
 */
const validateData = (
	data: z.infer<typeof envValidationSchema>,
	type: "POST" | "PATCH"
) =>
	(type === "POST"
		? envValidationSchema
		: envValidationSchema.partial()
	).safeParse(data);

export { validateData };
export default Envs;
