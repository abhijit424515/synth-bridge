import axios from "axios";
import { MLE_DOMAIN } from "../config/index.js";

// Function to initialize a KTR service
export async function ktr_init(id) {
	const response = await axios.get(`${MLE_DOMAIN}/services/openai/ktr/init?id=${id}`);
	return response.data;
}

// Function to store data in a KTR service
export async function ktr_store(id, text, ext = "txt") {
	const response = await axios.post(`${MLE_DOMAIN}/services/openai/ktr/store?id=${id}&ext=${ext}`, text);
	return response.data;
}

// Function to query a KTR service
export async function ktr_query(id, query, retain_history = false) {
	const response = await axios.post(`${MLE_DOMAIN}/services/openai/ktr/query`, {
		id,
		query,
		retain_history,
	});
	return response.data;
}

export async function taaft(query) {
	const response = await axios.get(`${MLE_DOMAIN}/services/openai/taaft?q=${query}`);
	return response.data;
}

// Function to process courses using OpenAI
export async function courses(query) {
	const response = await axios.get(`${MLE_DOMAIN}/services/openai/courses?q=${query}`);
	return response.data;
}

export async function project_summary(projectID, milestoneDescription, completedSubtasks, pendingSubtasks) {
	const response = await axios.post(`${MLE_DOMAIN}/services/openai/project_summary`, {
		projectID,
		milestoneDescription,
		completedSubtasks,
		pendingSubtasks,
	});
	return response.data;
}

export async function context_chat(id, prompt, query) {
	const response = await axios.post(`${MLE_DOMAIN}/services/openai/contextchat`, {
		id,
		prompt,
		query,
	});
	return response.data;
}
