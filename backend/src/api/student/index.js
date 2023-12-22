import { Router } from "express";
import bc from "bcryptjs";
import auth from "./auth.js";
import ErrorHandler from "../../lib/error-handler.js";
import JWTAuth from "../../middleware/jwt-auth.js";
import { findById, findByIdAndUpdate, findOne } from "../../helpers/index.js";
import { NOT_FOUND, BAD_REQUEST_400, INVALID_CREDENTIALS, OK_200, VALIDATION_FAILED } from "../../global/index.js";
import { GEN_SALT_ROUNDS } from "../../config/index.js";
import { change_password_$validate, profile_$validate } from "./index.validate.js";

const router = Router();
router.use("/auth", auth);

const MODEL = "STUDENT";

// ----------------------------------------------------------------

// Get user profile
router.get(
	"/profile",
	JWTAuth,
	ErrorHandler(async (req, res) => {
		const user = await findById(MODEL, req.user._id, { auth: 0, __v: 0 });
		if (!user) return res.status(BAD_REQUEST_400).json({ errorCode: NOT_FOUND });

		return res.status(OK_200).json(user);
	})
);

// Update user profile
router.put(
	"/profile",
	JWTAuth,
	ErrorHandler(async (req, res) => {
		if (!profile_$validate(req.body)) return res.status(BAD_REQUEST_400).json({ errorCode: VALIDATION_FAILED });

		await findByIdAndUpdate(MODEL, req.user._id, { $set: { info: req.body } });
		return res.status(OK_200).send();
	})
);

// Change user password
router.post(
	"/change-password",
	JWTAuth,
	ErrorHandler(async (req, res) => {
		const { old_password, new_password } = req.body;
		if (!change_password_$validate(req.body)) return res.status(BAD_REQUEST_400).json({ errorCode: VALIDATION_FAILED });

		const salt = await bc.genSalt(GEN_SALT_ROUNDS);

		const hashed_old_password = await bc.hash(old_password, salt);
		const user = await findOne(MODEL, { _id: req.user._id, password: hashed_old_password });
		if (!user) return res.status(BAD_REQUEST_400).json({ errorCode: INVALID_CREDENTIALS });

		const hashed_new_password = await bc.hash(new_password, salt);
		await findByIdAndUpdate(MODEL, req.user._id, { "auth.value": hashed_new_password });

		return res.status(OK_200).send();
	})
);

export default router;
