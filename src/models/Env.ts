import mongoose, { Schema } from "mongoose";
import { z } from "zod";

const envSchema = new Schema(
	{
		name: { type: String, required: true },
		url: { type: String, required: true },
	},
	{ versionKey: false }
);

const Envs = mongoose.model("env", envSchema);

const envValidationSchema = z.object({
	name: z.string({ required_error: "Name is required" }).max(50),
	url: z
		.string({ required_error: "URL is required" })
		.url({ message: "Invalid URL" })
		.max(255),
});

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
