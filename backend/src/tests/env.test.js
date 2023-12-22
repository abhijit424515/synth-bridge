import {
	HTTP_PORT,
	SOCKET_PORT,
	MONGO_URI,
	DB_NAME,
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRY,
	GEN_SALT_ROUNDS,
	ZOHO_MAIL,
	ZOHO_PASSWORD,
	OTP_EXPIRY,
	REDIS,
	OPENAI_API_KEY,
} from "../config/index.js";

test("VALIDATORS", () => {
	expect(HTTP_PORT).not.toBeUndefined();
	expect(SOCKET_PORT).not.toBeUndefined();
	expect(MONGO_URI).not.toBeUndefined();
	expect(DB_NAME).not.toBeUndefined();
	expect(ACCESS_TOKEN_SECRET).not.toBeUndefined();
	expect(ACCESS_TOKEN_EXPIRY).not.toBeUndefined();
	expect(REFRESH_TOKEN_SECRET).not.toBeUndefined();
	expect(REFRESH_TOKEN_EXPIRY).not.toBeUndefined();
	expect(GEN_SALT_ROUNDS).not.toBeNaN();
	expect(ZOHO_MAIL).not.toBeUndefined();
	expect(ZOHO_PASSWORD).not.toBeUndefined();
	expect(OTP_EXPIRY).not.toBeUndefined();
	expect(REDIS).not.toBeUndefined();
	expect(OPENAI_API_KEY).not.toBeUndefined();
});
