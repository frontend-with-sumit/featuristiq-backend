import mongoose, { Schema } from "mongoose";
import { z } from "zod";

type Project = z.infer<typeof project>;

const project = z.object({
	name: z.string({ required_error: "Name is required" }).min(5).max(255),
	description: z.string().min(5).max(255).optional(),
});

const projectSchema = new Schema<Project>({
	name: { type: String, required: true },
	description: { type: String },
});

const Project = mongoose.model<Project>("Project", projectSchema);

const validateData = (data: Project) => project.safeParse(data);

export { validateData };
export default Project;
