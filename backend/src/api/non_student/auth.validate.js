import Joi from "joi-oid";
import { email_$format, jwt_$format, otp_$format, password_$format } from "../../global/validators.js";

// Validate the login credentials
export function login_$validate(email, password) {
	const schema = Joi.object({
		email: email_$format,
		password: password_$format,
	});

	return !Boolean(schema.validate({ email, password }).error);
}

// Validate the NAT (Network Address Translation) token
export function nat_$validate(jwt) {
	const schema = Joi.object({
		jwt: jwt_$format,
	});

	return !Boolean(schema.validate({ jwt }).error);
}

// Validate the email for sending OTP
export function send_otp_$validate(email) {
	const schema = Joi.object({
		email: email_$format,
	});

	return !Boolean(schema.validate({ email }).error);
}

// Validate the email, password, and OTP for OTP verification
export function verify_otp_$validate(email, password, otp) {
	const schema = Joi.object({
		email: email_$format,
		password: password_$format,
		otp: otp_$format,
	});

	return !Boolean(schema.validate({ email, password, otp }).error);
}
