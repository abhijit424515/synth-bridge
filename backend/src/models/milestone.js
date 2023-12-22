import mongoose from "mongoose";

const MILESTONE = mongoose.model(
	"milestone",
	mongoose.Schema({
		status: {
			type: Boolean,
			default: false,
		},
		files: {
			type: [String],
			default: [],
		},
		description: String,
		subtasks: [
			{
				ref: "subtask",
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		courses: [
			{
				title: String,
				url: String,
				img: String,
				data: Object,
			},
		],
	}),
	"milestone"
);
export default MILESTONE;
