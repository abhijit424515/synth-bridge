import MODELS from "../models/index.js";

export async function find(model, query, projection = {}, options = {}) {
	return MODELS[model].find(query, projection, options).exec();
}

export async function count(model, query, projection = {}, options = {}) {
	return MODELS[model].count(query, projection, options).exec();
}

export async function findById(model, id, projection = {}, options = {}) {
	return MODELS[model].findById(id, projection, options).exec();
}

export async function findByIdAndDelete(model, id, options = {}) {
	return MODELS[model].findByIdAndDelete(id, options).exec();
}

export async function findByIdAndUpdate(model, id, update, options = {}) {
	return MODELS[model].findByIdAndUpdate(id, update, options).exec();
}

export async function findOne(model, query, projection = {}, options = {}) {
	return MODELS[model].findOne(query, projection, options).exec();
}

export async function findOneAndDelete(model, query, options = {}) {
	return MODELS[model].findOneAndDelete(query, options).exec();
}

export async function findOneAndReplace(model, query, replacement, options = {}) {
	return MODELS[model].findOneAndReplace(query, replacement, options).exec();
}

export async function findOneAndUpdate(model, query, update, options = {}) {
	return MODELS[model].findOneAndUpdate(query, update, options).exec();
}

export async function create(model, object) {
	return MODELS[model].create(object);
}

export async function insertMany(model, objects) {
	return MODELS[model].insertMany(objects);
}

export async function updateMany(model, query, update) {
	return MODELS[model].updateMany(query, update).exec();
}
