import { Router } from "express";
import { OK_200 } from "../../global/index.js";
import ErrorHandler from "../../lib/error-handler.js";
import { courses } from "../../helpers/fast-api.js";

const router = Router();

// ----------------------------------------------------------------

// Fetch course information based on the provided description.
router.post(
	"/courses",
	ErrorHandler(async (req, res) => {
		const { description } = req.body;
		const response = await courses(description);
		return res.status(OK_200).json({ response });
	})
);

export default router;
