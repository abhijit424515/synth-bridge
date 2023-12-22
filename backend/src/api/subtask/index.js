import { Router } from "express";
import ErrorHandler from "../../lib/error-handler.js";
import { findById, findByIdAndUpdate, insertMany } from "../../helpers/index.js";
import { OK_200 } from "../../global/index.js";
import MILESTONE from "../../models/milestone.js";
import SUBTASK from "../../models/subtask.js";
const router = Router();

// Get subtasks associated with a milestone ID.
router.get(
	"/",
	ErrorHandler(async (req, res) => {
		const { milestone_id } = req.body;
		const milestone = await findById("MILESTONE", milestone_id);
		const subtasks = await Promise.all(
			milestone.subtasks.map(async subtask_id => {
				const subtask = await findById("SUBTASK", subtask_id);
				return subtask;
			})
		);

		return res.status(OK_200).json({ subtasks });
	})
);

// Create subtasks for a milestone ID.
router.post(
	"/",
	ErrorHandler(async (req, res) => {
		const { subtasks, milestone_id } = req.body;
		const milestone = await findById("MILESTONE", milestone_id);
		let ids = milestone.subtasks.map(x => x._id);
		await MILESTONE.deleteMany({ _id: { $in: ids } });

		let sub_docs = subtasks.map(x => ({ description: x }));
		sub_docs = await insertMany("SUBTASK", sub_docs);
		ids = sub_docs.map(x => x._id);

		await findByIdAndUpdate("MILESTONE", milestone_id, { subtasks: ids }, { new: true });
		return res.status(OK_200).json({ _id: sub_docs });
	})
);

// Update subtasks and milestone status using a milestone ID.
router.put(
	"/",
	ErrorHandler(async (req, res) => {
		const { milestone_id, subtasks } = req.body;
		const milestone = await findById("MILESTONE", milestone_id);
		for (let i = 0; i < subtasks.length; i++) {
			if (!subtasks[i].status) {
				milestone.status = false;
				await milestone.save();
				break;
			}
			milestone.status = true;
			await milestone.save();
		}
		let ids = milestone.subtasks.map(x => x._id);
		await SUBTASK.deleteMany({ _id: { $in: ids } });

		const sub_docs = await insertMany("SUBTASK", subtasks);
		ids = sub_docs.map(x => x._id);
		await findByIdAndUpdate("MILESTONE", milestone_id, { subtasks: ids });
		return res.status(OK_200).json({ subtasks: sub_docs });
	})
);

// Delete a subtask from a milestone.
router.delete(
	"/",
	ErrorHandler(async (req, res) => {
		const { subtask_id, milestone_id } = req.body;
		await deleteOne("SUBTASK", subtask_id);
		const milestone = await findById("MILESTONE", milestone_id);
		milestone.subtasks = milestone.subtasks.filter(x => x != subtask_id);
		await milestone.save();

		return res.status(OK_200).json({ _id: subtask_id });
	})
);

export default router;
