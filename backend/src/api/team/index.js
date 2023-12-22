import { Router } from "express";
import ErrorHandler from "../../lib/error-handler.js";
import JWTAuth from "../../middleware/jwt-auth.js";
import { count, create, updateMany } from "../../helpers/index.js";
import { ALREADY_EXISTS, BAD_REQUEST_400, OK_200 } from "../../global/index.js";

const router = Router();

// ----------------------------------------------------------------

// Create a team
router.post(
	"/create",
	JWTAuth,
	ErrorHandler(async (req, res) => {
		const { students } = req.body;
		const check =
			students.length ==
			(await count("STUDENT", { _id: { $in: students }, team: { $exists: false } }, { _id: 1, team: 1 }));
		if (!check) return res.status(BAD_REQUEST_400).json({ errorCode: ALREADY_EXISTS });
		const { _id } = await create("TEAM", { members: students });
		await updateMany("STUDENT", { _id: { $in: students } }, { team: _id });
		return res.status(OK_200).send();
	})
);

export default router;
