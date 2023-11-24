import config from "config";
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";

interface User extends Document {
	first_name: string;
	last_name?: string;
	usage: string;
	personal_email?: string;
	work_email?: string;
	company_name?: string;
	phone_number: string;
	password: string;
	is_admin: boolean;
	generateAuthToken(): string;
}

const userSchema = new Schema(
	{
		first_name: { type: String, required: true, trim: true },
		last_name: { type: String, trim: true },
		usage: { type: String, required: true },
		personal_email: {
			type: String,
			trim: true,
			unique: true,
			sparse: true,
		},
		work_email: {
			type: String,
			trim: true,
			unique: true,
			sparse: true,
		},
		company_name: { type: String, trim: true },
		phone_number: { type: String, required: true, trim: true },
		password: { type: String, required: true },
		is_admin: { type: String, required: true, default: true },
	},
	{
		versionKey: false,
		methods: {
			generateAuthToken() {
				return jwt.sign(
					{ _id: this._id, usage: this?.usage, is_admin: this.is_admin },
					config.get("JWT_PRIVATE_KEY")
				);
			},
		},
	}
);

const User = mongoose.model<User>("user", userSchema);

const PHONE_REGEX = /^\+?\d+$/;
const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+{}|;:'",.<>?/`~[\]\\]).{6,}$/;

const userFields = {
	first_name: z
		.string({ required_error: "First name is required" })
		.min(3)
		.max(50)
		.trim(),
	last_name: z
		.string({ required_error: "Last name is required" })
		.min(3)
		.max(50)
		.trim()
		.optional(),
	usage: z.enum(["personal", "company"]),
	personal_email: z.string().email().trim().optional(),
	work_email: z.string().email().trim().optional(),
	company_name: z
		.string({ required_error: "Company is required" })
		.min(3)
		.max(50)
		.trim()
		.optional(),
	phone_number: z
		.string({
			required_error: "Phone number is required",
			invalid_type_error: "Invalid phone numeber format",
		})
		.trim()
		.refine((val) => (PHONE_REGEX.test(val) ? val : null)),
	password: z
		.string({ required_error: "Password is required" })
		.min(1)
		.max(1024)
		.refine((val) => PASSWORD_REGEX.test(val)),
};

/**
 * If usage is personal, personal_email field is mandatory
 * If usage is company, work_email and company_name is mandatory
 * Applicable only while creating a new user
 */
const postValidationSchema = z
	.object({
		...userFields,
	})
	.superRefine((arg, ctx) => {
		if (arg.usage === "personal" && !arg.personal_email) {
			return ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["personal_email"],
				message: "Personal email is required",
			});
		}

		if (arg.usage === "company") {
			if (!arg.work_email)
				return ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["work_email"],
					message: "Work email is required",
				});

			if (!arg.company_name)
				return ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["company_name"],
					message: "Company name is required",
				});
		}

		return z.NEVER;
	});

const patchValidationSchema = z.object({
	...userFields,
});

/**
 * Validate the request body as per the schema rules.
 * ```type``` is important, based on that different validation rules are applied on the data
 * @param data - Request body
 * @param type - Request type, can be either POST or PATCH
 * @returns zod safeParse object
 */
const validateData = (
	data: z.infer<typeof postValidationSchema>,
	type: "POST" | "PATCH"
) =>
	(type === "POST"
		? postValidationSchema
		: patchValidationSchema.partial()
	).safeParse(data);

export { validateData };
export default User;
