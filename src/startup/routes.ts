import { Express } from "express";
import parser from "body-parser";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../swagger.json";

import auth from "../middlewares/auth";

import authRoutes from "../routes/auth";
import userRoutes from "../routes/users";
import projectRoutes from "../routes/projects";
import envRoutes from "../routes/envs";
import flagRoutes from "../routes/flags";

export default function routes(app: Express) {
	app.use(parser.json());

	/**
	 * Swagger docs
	 */
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	/**
	 * User
	 */
	app.use("/api/auth", authRoutes);
	app.use("/api/user", userRoutes);

	app.use(auth);
	/**
	 * Flags
	 */
	app.use("/api/flags", flagRoutes);

	/**
	 * Environment
	 */
	app.use("/api/envs", envRoutes);

	/**
	 * Project
	 */
	app.use("/api/projects", projectRoutes);
}
