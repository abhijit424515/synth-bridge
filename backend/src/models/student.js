import mongoose from "mongoose";

const STUDENT = mongoose.model(
	"student",
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
		college: String,
		resume: String,
		year_of_study: Number,
		interests: [String],
		skills: {
			type: Map,
			of: Number,
		},
		team: {
			ref: "team",
			type: mongoose.Schema.Types.ObjectId,
		},
		rating: Number,
	}),
	"student"
);
export default STUDENT;
