import { Express } from "express";
import parser from "body-parser";
import projects from "../routes/projects";

export default function routes(app: Express) {
	app.use(parser.json());
	app.use("/api/projects", projects);
}
