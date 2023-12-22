import mongoose from "mongoose";

const SUBTASK = mongoose.model(
	"subtask",
	mongoose.Schema({
		description: String,
		status: {
			type: Boolean,
			default: false,
		},
		client_score: Number,
		docs: [String],
	}),
	"subtask"
);
export default SUBTASK;
