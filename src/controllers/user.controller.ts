import { Request, Response } from "express";
import config from "config";
import bcrypt from "bcrypt";
import { pick } from "lodash";

import User from "../models/User";
import generateResponse from "../shared/utils/generateResponse";
import { Nullable } from "../shared/types";

interface IUser {
	_id: string;
	usage: string;
}

export interface CustomRequest extends Request {
	user?: Nullable<IUser>;
}

const getUser = async (req: CustomRequest, res: Response) => {
	const user = await User.findById(req?.user?._id).select("-password");

	if (!user)
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "Invalid user",
			})
		);

	return res.status(200).send(
		generateResponse({
			requestType: "GET",
			responseType: "success",
			items: user,
		})
	);
};

const registerUser = async (req: Request, res: Response) => {
	const {
		first_name,
		last_name,
		usage,
		personal_email,
		work_email,
		company_name,
		country,
		phone_number,
		password,
	} = req.body;

	// Already registered user
	let user = await User.findOne(
		usage === "personal" ? { personal_email } : { work_email }
	);

	if (user)
		return res.status(400).send(
			generateResponse({
				requestType: "OTHER",
				responseType: "error",
				code: 400,
				message: "User already registered",
			})
		);

	const hashedPassword = await bcrypt.hash(password, config.get("SALT"));

	user = new User({
		first_name,
		last_name,
		usage,
		...(usage === "personal"
			? { personal_email }
			: { work_email, company_name }),
		country,
		phone_number,
		password: hashedPassword,
		isAdmin: true,
	});

	await user.save();

	res.status(200).send(
		generateResponse({
			requestType: "POST",
			responseType: "success",
			items: pick(user, [
				"_id",
				"first_name",
				"last_name",
				...(usage === "personal"
					? ["personal_email"]
					: ["work_email", "company_name"]),
				"phone_number",
				"is_admin",
			]),
		})
	);
};

export { getUser, registerUser };
