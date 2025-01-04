import {describe, it} from "node:test";
import {join} from "node:path";
import {readFile} from "node:fs/promises";

describe("E2E", () =>
{
    it("should extract text from a PDF", async () =>
    {
        const {extractText} = await import("../main/PDF.js");
        const pdf = await readFile(join(import.meta.dirname, "PDFTest.pdf"));
        const text = await extractText(new Uint8Array(pdf));
        console.log(text);

        const {split} = await import("../main/AI.js");
        const sections = await split(text!);
        console.log(sections);

        const {grade} = await import("../main/AI.js");
        const chapters = Object.entries(sections!).map(([title, chapter]) => ({title, chapter}));
        const results = await Promise.all(chapters.map(({title, chapter}) => grade(chapter, title)));
        console.log(results);
    });
});