import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import compression from "compression";
import http from "http";
import { Server } from "socket.io";
import proxy from "express-http-proxy";

import log from "./lib/log.js";
import team from "./api/team/index.js";
import connect from "./config/connect.js";
import student from "./api/student/index.js";
import project from "./api/project/index.js";
import non_student from "./api/non_student/index.js";
import subtask from "./api/subtask/index.js";
import services from "./api/services/index.js";
import { HTTP_PORT, MLE_DOMAIN, SOCKET_PORT } from "./config/index.js";
import { ktr_init, ktr_query, taaft } from "./helpers/fast-api.js";

connect();

const app = express();
app.use(express.raw({ type: ["application/pdf", "text/plain", "audio/webm"], limit: "20mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookies());
app.use(compression());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use("/fast-api", proxy(MLE_DOMAIN));

// ROUTES
app.use("/api/student", student);
app.use("/api/non_student", non_student);
app.use("/api/team", team);
app.use("/api/services", services);
app.use("/api/project", project);
app.use("/api/subtask", subtask);

const sockets = http.createServer(app);
const sc = new Server(sockets, {
	cors: {
		origin: "*",
		credentials: true,
	},
});

sc.on("connection", async socket => {
	socket.on("init", async id => {
		try {
			const res = await ktr_init(id);
			socket.emit("init", JSON.stringify(res));
		} catch (e) {
			console.log(e);
			socket.emit("error", e);
		}
	});
	socket.on("message", async data => {
		try {
			const { _id, message } = JSON.parse(data);
			const res = await ktr_query(_id, message, true);
			socket.emit("message", JSON.stringify(res));
		} catch (e) {
			console.log(e);
			socket.emit("error", e);
		}
	});
	socket.on("improve", async response => {
		try {
			const tools = await taaft(response);
			socket.emit("improve", JSON.stringify({ tools }));
		} catch (e) {
			console.log(e);
			socket.emit("error", e);
		}
	});
});

app.listen(HTTP_PORT, () => log(`HTTP_PORT: ${HTTP_PORT}`));
sockets.listen(SOCKET_PORT, () => log(`SOCKET_PORT: ${SOCKET_PORT}`));
