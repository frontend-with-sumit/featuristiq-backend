import { NextFunction, Request, Response } from "express";
import formatZodError from "../shared/utils/formatZodError";
import generateResponse from "../shared/utils/generateResponse";
import { Requests } from "../shared/types";

/**
 * Curried middleware to validate the request body.
 * If the body data is not valid, return 400 error.
 * @param fn - Custom validation function
 */
const validateBody =
	(fn: Function) => (req: Request, res: Response, next: NextFunction) => {
		const validData = fn(req.body, req.method);

		if (!validData.success) {
			const errors = formatZodError(validData.error.issues);
			return res.status(400).send(
				generateResponse({
					requestType: req.method as Requests,
					responseType: "error",
					errors,
				})
			);
		}

		next();
	};

export { validateBody };
