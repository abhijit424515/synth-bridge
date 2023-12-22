import mongoose from "mongoose";

const PROJECT = mongoose.model(
	"project",
	mongoose.Schema({
		title: String,
		description: String,
		experience: String,
		files: [String],
		milestones: [
			{
				ref: "milestone",
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		team: {
			ref: "team",
			type: mongoose.Schema.Types.ObjectId,
		},
		company: {
			ref: "non_student",
			type: mongoose.Schema.Types.ObjectId,
		},
		skills_required: [String],
		budget_min: Number,
		budget_max: Number,
		timeline: [
			{
				title: String,
				description: String,
				milestone_payment: Object,
			},
		],
	}),
	"project"
);
export default PROJECT;
