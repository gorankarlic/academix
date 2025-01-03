import cors from "cors";
import express from "express";
import {Upload} from "./Upload";

const {HOST = "localhost", PORT = 3000} = process.env;

const app = express();
app.use(express.json());
app.use(express.raw({limit: "10MB"}));
app.use(cors());
app.post("/upload/", (req, res, next) => Upload(req, res).catch(next));

const server = app.listen(Number(PORT), HOST, () => console.info(`Server listening on ${HOST}:${PORT}`));
process.on("SIGINT", () => server.close(() =>
{
    console.info("Server stopped.");
    process.exit(0);
}));