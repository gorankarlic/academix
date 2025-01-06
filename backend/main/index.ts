import cors from "cors";
import express from "express";
import {Upload} from "./Upload.js";

const {HOST = "localhost", PORT = 3000, ROOT = ""} = process.env;

const app = express();
app.use(express.json());
app.use(express.raw({limit: "10MB"}));
app.use(express.static(ROOT));
app.use(cors());
app.post("/upload/", (req, res, next) => Upload(req as Parameters<typeof Upload>[0], res).catch(next));

const server = app.listen(Number(PORT), HOST, () => console.info(`Server listening on ${HOST}:${PORT}`));
const shutdown = () => server.close(() => console.info("Server stopped."));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);