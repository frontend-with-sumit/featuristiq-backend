import express, { Express } from "express";

const PORT: string | number = process.env.PORT || 3000;
const app: Express = express();

app.listen(PORT, () => {
	console.log(`[Server]: Listening on PORT ${PORT}`);
});
