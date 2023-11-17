import express, { Express } from "express";
import config from "config";
import connectToDb from "./startup/db";

const PORT: string | number = config.get<string>("PORT") || 3000;
const app: Express = express();

app.listen(PORT, () => {
	console.log(`⚡️Listening on port ${PORT}`);
	connectToDb();
});
