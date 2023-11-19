import { Request, NextFunction, Response } from "express";
import mongoose from "mongoose";
import generateResponse from "../shared/utils/generateResponse";

/**
 * Middleware to validate the id in the url.
 * If the ```id``` is not a valid MONGODB_OBJECT_ID, return 400 error.
 */
const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Invalid ID",
			})
		);

	next();
};

export default validateObjectId;
