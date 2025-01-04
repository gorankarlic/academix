import {getDocument} from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractText = async (pdf: Uint8Array) =>
{
    try
    {
        const {promise} = getDocument({data: pdf, useSystemFonts: true});
        const document = await promise;
        const text = [];
        for(let i = 1; i <= document.numPages; i++)
        {
            const page = await document.getPage(i);
            const {items} = await page.getTextContent();
            text.push(items.flatMap((item) => "str" in item ? [item] : []).map(({str}) => str).join(" "));
        }
        return text.join(" ").replaceAll(/\s+/g, " ").trim();
        
    }
    catch(e)
    {
        if(e instanceof Error)
        {
            const {name} = e;
            if(name === "InvalidPDFException")
            {
                console.error("Invalid PDF", e);
                return null;
            }
            else
            {
                throw e;
            }
        }
        else
        {
            throw e;
        }
    }
};