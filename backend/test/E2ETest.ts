import {describe, it} from "node:test";
import {join} from "node:path";
import {readFile} from "node:fs/promises";
import {type Result, Titles} from "../main/API.js";

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
        const present = Object.entries(sections!).flatMap(([title, section]) => section === null ? [] : [{section, title: title as typeof Titles[number]}]);
        const results = await Promise.all(present.map(({section, title}) => grade(section, title)));
        const response = Object.fromEntries(results.map((grade, index) => ({section: present[index], grade})).flatMap<[keyof Result, Result[keyof Result]]>(({section: {title}, grade}) => grade === null ? [] : [[title, grade]]));
        console.log(results);
    });
});