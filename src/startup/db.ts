import mongoose from "mongoose";
import config from "config";

const connectToDB = () => {
	return mongoose
		.connect(config.get<string>("DB_URI"))
		.then(() => console.log(`✅ Connected to DB`))
		.catch(() => console.log("❌ DB connection failed"));
};

export default connectToDB;
