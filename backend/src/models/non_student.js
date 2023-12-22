import mongoose from "mongoose";

const NON_STUDENT = mongoose.model(
	"non_student",
	mongoose.Schema({
		info: {
			name: String,
			email: String,
		},
		auth: {
			mode: {
				type: String,
				enum: [],
			},
			value: String,
			refreshToken: String,
		},
		company: String,
		college: String,
		is_client: Boolean,
		projects_going_on: [
			{
				ref: "project",
				type: mongoose.Schema.Types.ObjectId,
			},
		],
	}),
	"non_student"
);
export default NON_STUDENT;
