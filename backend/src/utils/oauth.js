import axios from "axios";
import querystring from "querystring";
import { GOOGLE_CLIENT_ID, HTTP_PORT } from "../config/index.js";

// Function to get tokens from Google OAuth
export async function get_tokens({ code, client_id, client_secret, redirect_uri }) {
	const url = "https://oauth2.googleapis.com/token";
	const values = {
		code,
		client_id,
		client_secret,
		redirect_uri,
		grant_type: "authorization_code",
	};

	return axios
		.post(url, querystring.stringify(values), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then(res => res.data)
		.catch(error => {
			console.error(`Failed to fetch auth tokens`);
			throw new Error(error.message);
		});
}

// Function to get Google OAuth URL
export function get_google_auth_url() {
	const options = {
		redirect_uri: `http://localhost:${HTTP_PORT}/api/auth/google`,
		client_id: GOOGLE_CLIENT_ID,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
			" "
		),
	};

	return `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(options)}`;
}
