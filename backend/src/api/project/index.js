import { Router } from "express";
import ErrorHandler from "../../lib/error-handler.js";
import { OK_200 } from "../../global/index.js";
import { create, findById, findByIdAndUpdate } from "../../helpers/index.js";
import { gcp_upload, gcp_find } from "../../utils/gcp.js";
import { ktr_store, project_summary, context_chat } from "../../helpers/fast-api.js";
import PROJECT from "../../models/project.js";
import MILESTONE from "../../models/milestone.js";
import NON_STUDENT from "../../models/non_student.js";

const router = Router();
const MODEL = "PROJECT";

// ----------------------------------------------------------------

// Get project details by ID.
router.get(
	"/",
	ErrorHandler(async (req, res) => {
		const { _id } = req.query;
		const x = await PROJECT.findById(_id).populate({ path: "milestones", populate: { path: "subtasks" } });
		return res.status(OK_200).json(x);
	})
);

// Create a new project.
router.post(
	"/",
	ErrorHandler(async (req, res) => {
		const { title, description, milestones } = req.body;
		let ids = [];
		for (let i = 0; i < milestones.length; i++) {
			const { _id } = await create("MILESTONE", { description: milestones[i] });
			ids.push(_id);
		}
		const { _id } = await create(MODEL, { title, description, milestones: ids });
		const data = `Title: ${title}\nDescription: ${description}\nMilestones: ${milestones.toString()}`;
		await ktr_store(_id, data);
		return res.status(OK_200).json({ _id });
	})
);

// Update a project by ID.
router.put(
	"/",
	ErrorHandler(async (req, res) => {
		const { _id, update } = req.body;
		await findByIdAndUpdate(MODEL, _id, update);
		return res.status(OK_200).send();
	})
);

// Add a file to a project, which will be first stored in the cloud, and then also stored as embeddings
router.post(
	"/add-file",
	ErrorHandler(async (req, res) => {
		const { _id, name, ext, embed } = req.query;
		const x = await findById(MODEL, _id);

		const filename = `${_id}:${x.files.length}`;
		await gcp_upload(filename, req.body, { ext, oname: name });
		if (embed === true) await ktr_store(_id, req.body, ext);

		await findByIdAndUpdate(MODEL, _id, { files: [...x.files, `${name}.${ext}`] });
		return res.status(OK_200).send();
	})
);

// Add a file to a milestone.
router.post(
	"/add-milestone-file",
	ErrorHandler(async (req, res) => {
		const { _id, name, ext } = req.query;
		const x = await findById("MILESTONE", _id);

		const filename = `${_id}:${x.files.length}`;
		await gcp_upload(filename, req.body, { ext, oname: name });

		await findByIdAndUpdate("MILESTONE", _id, { files: [...x.files, `${name}.${ext}`] });
		return res.status(OK_200).send();
	})
);

// Create embeddings for an existing file in a project.
router.post(
	"/embed",
	ErrorHandler(async (req, res) => {
		const { filename, projectId } = req.body;
		const { file, metadata } = await gcp_find(filename);
		await ktr_store(projectId, file, metadata.ext);
		return res.status(OK_200).send();
	})
);

// Get projects associated with a client ID.
router.get(
	"/get-project",
	ErrorHandler(async (req, res) => {
		const { client_id } = req.query;
		const { projects_going_on } = await NON_STUDENT.findById(client_id).populate({
			path: "projects_going_on",
			populate: { path: "milestones" },
		});
		return res.status(OK_200).json({ projects: projects_going_on });
	})
);

// Get files associated with a project ID.
router.get(
	"/get-files",
	ErrorHandler(async (req, res) => {
		const { _id } = req.query;
		const { files } = await findById("PROJECT", _id);
		return res.status(OK_200).json({ files });
	})
);

// Get files associated with a milestone ID.
router.get(
	"/get-milestone-files",
	ErrorHandler(async (req, res) => {
		const { _id } = req.query;
		const { files } = await findById("MILESTONE", _id);
		return res.status(OK_200).json({ files });
	})
);

// Download a file by filename.
router.get(
	"/download-file",
	ErrorHandler(async (req, res) => {
		const { filename } = req.query;
		const file = await gcp_find(filename);
		return res.status(OK_200).json(file);
	})
);

// Generate subtasks associated with a milestone ID and project ID.
router.post(
	`/generate-subtask`,
	ErrorHandler(async (req, res) => {
		const { projectId, milestoneId } = req.body;
		const milestone = await MILESTONE.findById(milestoneId);
		const description = milestone.description;
		const prompt =
			`
		System : You are a subtask bot. Using the project context and milestone description given in backticks, generate a list of detailed subtasks for the given milestone. One subtask should be just one line long

		Context : \{context\}
		` +
			`
		Milestone Description : \{query\}

		Output Format : \[\"lorem ipsum\", \"lorem ipsum\" \]
		`;

		const response = await context_chat(projectId, prompt, description);
		let list = JSON.parse(response);
		return res.status(OK_200).json({ list });
	})
);

// Get details of multiple milestones.
router.get(
	"/get-milestones",
	ErrorHandler(async (req, res) => {
		const { milestone_ids } = req.body;
		const data = await Promise.all(
			milestone_ids.map(async milestone => {
				const { _id, description, subtasks } = await findById("MILESTONE", milestone);
				return { _id, description, subtasks };
			})
		);
		return res.status(OK_200).json({ data });
	})
);

// Get the aggregate summary of a project, including milestone and subtask information, using a project ID.
router.get(
	"/summary",
	ErrorHandler(async (req, res) => {
		const { projectID } = req.query;
		const project = await findById("PROJECT", projectID);
		let activeMilestoneInfo = null;
		let found = false;
		let totalSubtasks = 0;
		let finishedSubtasks = 0;

		for (let i = 0; i < project.milestones.length; i++) {
			const { status, description, subtasks } = await findById("MILESTONE", project.milestones[i]);
			if (!status && !found) {
				activeMilestoneInfo = { description, subtasks };
				found = true;
			}
			for (let j = 0; j < subtasks.length; j++) {
				const { status } = await findById("SUBTASK", subtasks[j]);
				totalSubtasks++;
				if (status) {
					finishedSubtasks++;
				}
			}
		}
		const milestoneDescription = activeMilestoneInfo.description;
		const subtasks = activeMilestoneInfo.subtasks;
		let completedSubtasks = [];
		let pendingSubtasks = [];
		for (let i = 0; i < subtasks.length; i++) {
			const { status, description } = await findById("SUBTASK", subtasks[i]);
			if (status) {
				completedSubtasks.push(description);
			} else {
				pendingSubtasks.push(description);
			}
		}

		const response = await project_summary(projectID, milestoneDescription, completedSubtasks, pendingSubtasks);
		return res.status(OK_200).json({
			project: project,
			response,
			totalSubtasks,
			finishedSubtasks,
			milestoneDescription,
		});
	})
);

export default router;
