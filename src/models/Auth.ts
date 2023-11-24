import { z } from "zod";

const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+{}|;:'",.<>?/`~[\]\\]).{6,}$/;

const loginValidationSchema = z.object({
	email: z.string().email().trim(),
	password: z
		.string({ required_error: "Password is required" })
		.min(1)
		.max(1024)
		.refine((val) => PASSWORD_REGEX.test(val)),
});

/**
 * Validate the request body as per the schema rules.
 * ```type``` is important, based on that different validation rules are applied on the data
 * @param data - Request body
 * @param type - Request type, can be either POST or PATCH
 * @returns zod safeParse object
 */
const validateData = (
	data: z.infer<typeof loginValidationSchema>,
	type: "POST"
) => loginValidationSchema.safeParse(data);

export { validateData };
