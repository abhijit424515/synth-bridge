import nm from "nodemailer";
import { ZOHO_MAIL, ZOHO_PASSWORD } from "../config/index.js";

const mailConfig = {
	host: "smtp.zoho.in",
	port: 465,
	secure: true,
	auth: {
		user: ZOHO_MAIL,
		pass: ZOHO_PASSWORD,
	},
};

// Send an email using Nodemailer.
export default async function sendmail(email, subject, content) {
	await nm.createTransport(mailConfig).sendMail({
		from: ZOHO_MAIL,
		to: email,
		subject,
		html: `<div>${content}</div>`,
	});
}
