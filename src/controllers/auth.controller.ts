import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateResponse from "../shared/utils/generateResponse";

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await User.findOne({
		$or: [{ personal_email: email }, { work_email: email }],
	});
	if (!user)
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "User not found",
			})
		);

	const isValidPassword = await bcrypt.compare(password, user?.password);

	if (!isValidPassword) {
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Incorrect password",
			})
		);
	}

	const token = user.generateAuthToken();

	res.header("x-auth-token", token).send(
		generateResponse({
			requestType: "POST",
			responseType: "success",
			items: {
				token,
			},
		})
	);
};

export { login };
