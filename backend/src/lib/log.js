import fs from "fs";
const logFile = fs.createWriteStream("logs.txt", { flags: "a" });

// Writes the provided data to the log file and standard output.
export default function log(data, end = "\n") {
	const newData = "[" + new Date().toISOString() + "]" + "\t" + data;
	logFile.write(newData + end);
	process.stdout.write(newData + end);
}
