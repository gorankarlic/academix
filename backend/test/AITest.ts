import {describe, it} from "node:test";
import {Titles} from "../main/API.js";

describe.skip("AI", () =>
{
    it("should split text into sections", async () =>
    {
        const {split} = await import("../main/AI.js");
        const text = Titles.map((title, index) => `${title}\nThis is part ${index}.`).join("\n\n");
        const result = await split(text);
        console.log(result);
    });
    
    it("should grade a chapter", async () =>
    {
        const {grade} = await import("../main/AI.js");
        const chapter = "This is a chapter.";
        const title = Titles[0];
        const result = await grade(chapter, title);
        console.log(result);
    });
});