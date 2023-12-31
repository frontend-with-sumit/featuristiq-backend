import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";

import generateResponse from "../shared/utils/generateResponse";
import { Nullable, Undefined } from "../shared/types";

interface User {
	_id: string;
	usage: string;
}

interface CustomRequest extends Request {
	user?: Nullable<User>;
}

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
	const authHeader = req.header("Authorization");
	const token: Undefined<string> = authHeader?.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.send(generateResponse({ requestType: "UNAUTH", responseType: "error" }));
	}

	try {
		const decodedToken = jwt.verify(token, config.get("JWT_PUBLIC_KEY"), {
			algorithms: ["RS256"],
		}) as JwtPayload;
		if (!decodedToken) throw new Error();

		// Create a new object with the required properties
		const user: User = {
			_id: decodedToken._id as string,
			usage: decodedToken.usage as string,
		};

		req.user = user;
		next();
	} catch (err) {
		res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Invalid token",
			})
		);
	}
};

export default auth;
