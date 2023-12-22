import mongoose from "mongoose";
import { MONGO_URI, DB_NAME, REDIS } from "./index.js";
import log from "../lib/log.js";
import { createClient } from "redis";

export const REDIS_CLIENT = createClient({ url: REDIS });
mongoose.set("strictQuery", false);

// Connects to MongoDB and Redis.
export default async function connect() {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: DB_NAME,
		});
		await REDIS_CLIENT.connect();
		log(`MongoDB ☑️ \t REDIS ☑️`);
	} catch (error) {
		log(`MongoDB ☠️ \t REDIS ☠️`);
		log(error);
		await REDIS_CLIENT.quit();
		process.exit(1);
	}
}
