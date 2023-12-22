import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { genSalt, hash, compare } = bcrypt;
const router = Router();

import { create, findByIdAndUpdate, findOne } from "../../helpers/index.js";
import {
	ALREADY_EXISTS,
	NOT_FOUND,
	BAD_REQUEST_400,
	INVALID_CREDENTIALS,
	INVALID_TOKEN,
	OK_200,
	OTP_EXPIRED,
	OTP_INVALID,
	UNAUTHORIZED_401,
	VALIDATION_FAILED,
} from "../../global/index.js";
import {
	ACCESS_TOKEN_EXPIRY,
	ACCESS_TOKEN_SECRET,
	GEN_SALT_ROUNDS,
	OTP_EXPIRY,
	REFRESH_TOKEN_EXPIRY,
	REFRESH_TOKEN_SECRET,
} from "../../config/index.js";
import { login_$validate, nat_$validate, send_otp_$validate, verify_otp_$validate } from "./auth.validate.js";
import ErrorHandler from "../../lib/error-handler.js";
import generate_otp from "../../utils/generate_otp.js";
import sendmail from "../../lib/mail.js";
import { REDIS_CLIENT } from "../../config/connect.js";

const MODEL = "NON_STUDENT";

// ----------------------------------------------------------------

// Handle login request
router.post(
	"/login",
	ErrorHandler(async (req, res) => {
		const { email, password } = req.body;
		if (!login_$validate(email, password)) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: VALIDATION_FAILED });
		}

		const student = await findOne(MODEL, { "info.email": email, "auth.mode": "email" });
		if (!student) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: NOT_FOUND });
		}

		const password_match = await compare(password, student.auth.value);
		if (!password_match) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: INVALID_CREDENTIALS });
		}

		const payload = { _id: student._id };
		const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
		const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
		await findByIdAndUpdate(MODEL, student._id, { "auth.refreshToken": refresh_token });

		res.cookie("access_token", access_token, {
			httpOnly: false,
			sameSite: "None",
			secure: false,
			maxAge: ACCESS_TOKEN_EXPIRY,
		});
		res.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			sameSite: "None",
			secure: false,
			maxAge: REFRESH_TOKEN_EXPIRY,
		});

		return res.status(OK_200).send();
	})
);

// Handle request for new access token
router.get(
	"/new-access-token",
	ErrorHandler(async (req, res) => {
		const { refresh_token } = req.cookies;
		if (!nat_$validate(refresh_token)) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: VALIDATION_FAILED });
		}
		const decoded = await jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

		const user = await findOne(MODEL, { _id: decoded._id, "auth.refreshToken": refresh_token });
		if (!user) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(UNAUTHORIZED_401).json({ errorCode: INVALID_TOKEN });
		}

		const access_token = jwt.sign({ _id: decoded._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
		res.cookie("access_token", access_token, {
			httpOnly: false,
			sameSite: "None",
			secure: false,
			maxAge: ACCESS_TOKEN_EXPIRY,
		});
		return res.status(OK_200).send();
	})
);

// Handle request to send OTP
router.post(
	"/send-otp",
	ErrorHandler(async (req, res) => {
		const { email } = req.body;
		if (!send_otp_$validate(email)) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: VALIDATION_FAILED });
		}

		let user = await findOne(MODEL, { "info.email": email });
		if (user) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: ALREADY_EXISTS });
		}

		const otp = generate_otp();
		await REDIS_CLIENT.set(email, otp, { EX: parseInt(OTP_EXPIRY) / 1000 });
		await sendmail(email, "Registration OTP", `Your OTP is ${otp}`);

		return res.status(OK_200).send();
	})
);

// Handle request to verify OTP
router.post(
	"/verify-otp",
	ErrorHandler(async (req, res) => {
		const { email, password, otp } = req.body;
		if (!verify_otp_$validate(email, password, otp)) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: VALIDATION_FAILED });
		}

		const stored_otp = await REDIS_CLIENT.get(email);
		if (!stored_otp) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: OTP_EXPIRED });
		}
		if (otp != stored_otp) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(BAD_REQUEST_400).json({ errorCode: OTP_INVALID });
		}
		await REDIS_CLIENT.del(email);

		const hashed_password = await hash(password, await genSalt(GEN_SALT_ROUNDS));
		const student = await create(MODEL, { "info.email": email, "auth.mode": "email", "auth.value": hashed_password });

		const payload = { _id: student._id };
		const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
		const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
		await findByIdAndUpdate(MODEL, student._id, { "auth.refreshToken": refresh_token });

		res.cookie("access_token", access_token, {
			httpOnly: false,
			sameSite: "None",
			secure: false,
			maxAge: ACCESS_TOKEN_EXPIRY,
		});
		res.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			sameSite: "None",
			secure: false,
			maxAge: REFRESH_TOKEN_EXPIRY,
		});

		return res.status(OK_200).send();
	})
);

export default router;
