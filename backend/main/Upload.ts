import {extractText} from "./PDF.js";
import {grade, Grades, split, Titles} from "./AI.js";
import type {Request, Response} from "express";

export async function Upload(req: Request<{}, {}, Buffer>, res: Response<{[K in typeof Titles[number]]: typeof Grades[keyof typeof Grades]}>): Promise<void>
{
    const {body, headers} = req;
    const contentType = headers["x-content-type"];
    console.log("Extracting text from a", contentType, "file");
    const text = contentType === "application/pdf" ? await extractText(new Uint8Array(body.buffer)) : new TextDecoder().decode(body);
    if(text === null)
    {
        res.writeHead(400, "Invalid PDF", {"Content-Type": "text/plain"});
        res.end();
    }
    else
    {
        console.log("Splitting text into sections");
        const sections = await split(text);
        if(sections === null)
        {
            res.writeHead(400, "Failed to split text", {"Content-Type": "text/plain"});
            res.end();
        }
        else
        {
            console.log("Grading sections");
            const chapters = Object.entries(sections!).map(([title, chapter]) => ({title: title as typeof Titles[number], chapter}));
            const results = await Promise.all(chapters.map(({title, chapter}) => grade(chapter, title)));
            const response = Object.fromEntries(results.flatMap((grade, index) => grade === null ? [] : [{chapter: chapters[index], grade}]).map(({chapter: {title}, grade: {grade}}) => [title, grade])) as {[K in typeof Titles[number]]: typeof Grades[keyof typeof Grades]};
            res.json(response);
        }
    }
}