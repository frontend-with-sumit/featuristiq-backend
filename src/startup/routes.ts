import { Express } from "express";
import parser from "body-parser";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../swagger.json";

import auth from "../routes/auth";
import users from "../routes/users";
import projects from "../routes/projects";
import envs from "../routes/envs";

export default function routes(app: Express) {
	app.use(parser.json());

	/**
	 * Swagger docs
	 */
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	/**
	 * User
	 */
	app.use("/api/auth", auth);
	app.use("/api/user", users);

	/**
	 * Project
	 */
	app.use("/api/projects", projects);

	/**
	 * Environment
	 */
	app.use("/api/envs", envs);
}
