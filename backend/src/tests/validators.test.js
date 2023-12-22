import { email_$format, mobile_$format, password_$format } from "../global/validators.js";

const email_$tests = {
	"john.doe123@gmail.com": true,
	"": false,
	"invalid_email.com": false,
	"user@domain": false,
	"@domain.com": false,
	"user@.com": false,
	"user@domain..com": false,
	"user@-domain.com": false,
	"user@domain.c": false,
	"user@domain.12": false,
};

const mobile_$tests = {
	1234567890: true,
	9876543210: true,
	5555555: false,
	123: false,
	abcdefghij: false,
	"9876543abc": false,
	12345678901: false,
	"9876543@10": false,
	"": false,
	"987654321o": false,
};

const password_$tests = {
	12345: false,
	password: true,
	"P@ssw0rd": true,
	abcdef: true,
	abcd12: true,
	"p@ss": false,
	PASSWORD: true,
	pa$$w0rd: true,
	123456: true,
	abcABC123: true,
};

test("VALIDATORS", () => {
	Object.keys(email_$tests).forEach(x => expect(!Boolean(email_$format.validate(x).error)).toBe(email_$tests[x]));
	Object.keys(mobile_$tests).forEach(x => expect(!Boolean(mobile_$format.validate(x).error)).toBe(mobile_$tests[x]));
	Object.keys(password_$tests).forEach(x =>
		expect(!Boolean(password_$format.validate(x).error)).toBe(password_$tests[x])
	);
});
