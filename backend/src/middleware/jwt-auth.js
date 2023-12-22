import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";
import { BAD_REQUEST_400, INVALID_TOKEN, UNAUTHORIZED_401, UNKNOWN_ERROR } from "../global/index.js";
import { jwt_$format } from "../global/validators.js";

// Generic middleware function for JWT authentication.
export default async function JWTAuth(req, res, next) {
	try {
		const { access_token } = req.cookies;
		const valid_token = !Boolean(jwt_$format.validate(access_token).error);
		if (!valid_token) return res.status(UNAUTHORIZED_401).json({ errorCode: INVALID_TOKEN });

		const decoded = jwt.verify(access_token, ACCESS_TOKEN_SECRET);
		req.user = { _id: decoded._id };
		next();
	} catch (error) {
		if (error.name == "JsonWebTokenError") return res.status(BAD_REQUEST_400).json({ errorCode: INVALID_TOKEN });
		return res.status(BAD_REQUEST_400).json({ errorCode: UNKNOWN_ERROR, error });
	}
}
