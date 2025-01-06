import {extractText} from "./PDF.js";
import {grade, split} from "./AI.js";
import {Result, Titles, Type} from "./API.js";
import type {Request, Response} from "express";

export async function Upload(req: Request<{}, {}, Buffer, {type: Type}>, res: Response<Result>): Promise<void>
{
    const {body, query: {type}} = req;
    console.log("Extracting text from a", type, "file");
    const text = type === "pdf" ? await extractText(new Uint8Array(body.buffer)) : new TextDecoder().decode(body);
    if(text === null)
    {
        res.writeHead(400, "Invalid PDF");
        res.end();
    }
    else
    {
        console.log("Splitting text into sections");
        const sections = await split(text);
        if(sections === null)
        {
            res.writeHead(400, "Failed to split text");
            res.end();
        }
        else
        {
            console.log("Grading sections");
            const chapters = Object.entries(sections!).map(([title, chapter]) => ({title: title as typeof Titles[number], chapter}));
            const results = await Promise.all(chapters.map(({title, chapter}) => grade(chapter, title)));
            const response = Object.fromEntries(results.map((grade, index) => ({chapter: chapters[index], grade})).flatMap<[keyof Result, Result[keyof Result]]>(({chapter: {title}, grade}) => grade === null ? [] : [[title, grade]]));
            res.json(response as Result);
        }
    }
}