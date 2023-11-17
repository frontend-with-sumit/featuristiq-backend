import { ZodIssue } from "zod";
import { generateErrorMessage, ErrorMessageOptions } from "zod-error";

import { ErrorDetail } from "../Types/types";

const options: ErrorMessageOptions = {
	delimiter: { error: "," },
	path: {
		enabled: true,
		type: "zodPathArray",
		label: null,
	},
	code: { enabled: false },
	message: {
		enabled: true,
		label: null,
	},
	transform: ({ pathComponent, messageComponent }) =>
		`{"field": "${
			JSON.parse(pathComponent)[0]
		}", "message": "${messageComponent}"}`,
};

const formatZodError = (issues: ZodIssue[]): ErrorDetail[] => {
	return issues.map((issue) => {
		const error = generateErrorMessage([issue], options);
		return JSON.parse(error);
	});
};

export default formatZodError;
