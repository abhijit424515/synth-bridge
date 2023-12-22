import mongoose from "mongoose";

const TEAM = mongoose.model(
	"team",
	mongoose.Schema({
		members: [
			{
				ref: "student",
				type: mongoose.Schema.Types.ObjectId,
			},
		],
	}),
	"team"
);
export default TEAM;
