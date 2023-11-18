import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

interface Project extends Document {
	name: string;
	description?: string;
}

const projectSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
	},
	{ versionKey: false }
);

const Project = mongoose.model<Project>("Project", projectSchema);

const projectValidationSchema = z.object({
	name: z.string({ required_error: "Name is required" }).min(5).max(255),
	description: z.string().min(5).max(255).optional(),
});

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
