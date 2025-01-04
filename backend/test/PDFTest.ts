import {describe, it} from "node:test";
import {join} from "node:path";
import {readFile} from "node:fs/promises";

describe("PDF", () =>
{
    it("should extract text from a PDF", async () =>
    {
        const pdf = await readFile(join(import.meta.dirname, "PDFTest.pdf"));
        const {extractText} = await import("../main/PDF.js");
        const text = await extractText(new Uint8Array(pdf));
        console.log(text);
    });
});