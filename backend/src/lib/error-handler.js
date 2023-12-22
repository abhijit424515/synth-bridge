import { BAD_REQUEST_400, UNKNOWN_ERROR } from "../global/index.js";

// Generic Error Handler
export default function ErrorHandler(handler) {
	return async (req, res) => {
		try {
			await handler(req, res);
		} catch (error) {
			return res.status(BAD_REQUEST_400).json({ errorCode: UNKNOWN_ERROR, error: error.stack });
		}
	};
}
