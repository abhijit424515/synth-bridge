import Joi from "joi-oid";
import { name_$format, password_$format } from "../../global/validators.js";

// Validate the profile data.
export function profile_$validate(data) {
	const schema = Joi.object({
		name: name_$format,
	});

	return !Boolean(schema.validate(data).error);
}

// Validate the change password data.
export function change_password_$validate(data) {
	const schema = Joi.object({
		oldPassword: password_$format,
		newPassword: password_$format,
	});

	return !Boolean(schema.validate(data).error);
}
