import { Storage } from "@google-cloud/storage";
const storage = new Storage({
	projectId: "interiit-407013",
	keyFilename: "../gcp-key.json",
});

// Upload a file with filename and metadata (optional) in Google Cloud Storage.
export async function gcp_upload(filename, data, metadata = {}) {
	const x = storage.bucket("synth-bridge").file(filename);
	await x.save(data);
	const m = await x.setMetadata({ metadata });
}

// Find a file using filename in Google Cloud Storage.
export async function gcp_find(filename) {
	const x = storage.bucket("synth-bridge").file(filename);
	const m = (await x.getMetadata())[0].metadata;
	const z = (await x.download())[0];
	return { metadata: m, file: z };
}
