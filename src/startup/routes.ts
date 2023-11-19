import { Express } from "express";
import parser from "body-parser";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../swagger.json";

import projects from "../routes/projects";

export default function routes(app: Express) {
	app.use(parser.json());
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	app.use("/api/projects", projects);
}
