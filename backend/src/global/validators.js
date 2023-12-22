import Joi from "joi-oid";

export const name_$format = Joi.string().min(3).required();
export const lastname_$format = Joi.string().min(3).optional().allow("");
export const email_$format = Joi.string()
	.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
	.required();
export const mobile_$format = Joi.string()
	.length(10)
	.pattern(/^[0-9]+$/)
	.required();
export const password_$format = Joi.string().min(6).required();
export const otp_$format = Joi.string()
	.length(6)
	.pattern(/^[0-9]+$/)
	.required();
export const pincode_$format = Joi.string()
	.length(6)
	.pattern(/^[0-9]+$/)
	.required();
export const gst_$format = Joi.string()
	.regex(/^[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
	.required();
export const iso_datestring_$format = Joi.date().iso().required();
export const NE_string_array_$format = Joi.array().items(Joi.string()).required();
export const jwt_$format = Joi.string()
	.regex(/^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/)
	.required();

// Address
export const addr_line_$format = Joi.string().min(3).required();
export const city_$format = Joi.string().min(3).required();
// prettier-ignore
export const state_$format = Joi.string()
.valid("Andhra Pradesh",	"Arunachal Pradesh",	"Assam",	"Bihar",	"Chhattisgarh",	"Goa",	"Gujarat",	"Haryana",	"Himachal Pradesh",	"Jharkhand",	"Karnataka",	"Kerala",	"Madhya Pradesh",	"Maharashtra",	"Manipur",	"Meghalaya",	"Mizoram",	"Nagaland",	"Odisha",	"Punjab",	"Rajasthan",	"Sikkim",	"Tamil Nadu",	"Telangana",	"Tripura",	"Uttar Pradesh",	"Uttarakhand",	"West Bengal")
	.required();
export const country_$format = Joi.string().valid("India").required();
