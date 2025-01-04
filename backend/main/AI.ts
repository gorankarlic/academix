import {OpenAI} from "openai";

export const Grades =
{
    0.0: "Fail",
    0.5: "Fail",
    1.0: "Fail",
    1.5: "Marginal",
    2.0: "Passable",
    2.5: "Satisfactory",
    3.0: "Good",
    3.5: "Superior",
    4.0: "Excellent"
} as const;

export const Titles =
[
    "Summary of the impact",
    "Underpinning research",
    "References to the research",
    "Details of the impact"
] as const;

const {OPENAI_API_KEY, OPENAI_MODEL} = process.env;
if(OPENAI_API_KEY === undefined || OPENAI_MODEL === undefined)
{
    throw new Error("missing environment variables");
}

const openai = new OpenAI({apiKey: OPENAI_API_KEY});

export const split = async (text: string) =>
{
    const request: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    {
        messages:
        [
            {
                content: `You are a helpful assistant that splits the given text into these four predefined sections ${Titles.map((title) => `"${title}"`).join(", ")}. You exclusively return the text from these sections and discard any other sections.`,
                role: "system"
            },
            {
                content: text,
                role: "user"
            }
        ],
        model: "gpt-4o",
        response_format:
        {
            json_schema:
            {
                name: "chapters",
                schema:
                {
                    properties:
                    {
                        ...Object.fromEntries(Titles.map((title) => [title, {description: `Text in the '${title}' section`, type: "string"}]))
                    },
                    required: Titles,
                    type: "object"
                }
            },
            type: "json_schema"
        },
        seed: 1
    };
    const {choices: [{message: {content, refusal}}]} = await openai.chat.completions.create(request);
    if(refusal === null)
    {
        try
        {
            return JSON.parse(content ?? "") as {[K in typeof Titles[number]]: string};
        }
        catch(error)
        {
            console.error("OpenAI returned invalid JSON", error);
            return null;
        }
    }
    else
    {
        console.error("OpenAI refused to split the text", refusal);
        return null;
    }
};

export const grade = async (chapter: string, title: string) =>
{
    const request: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    {
        //max_completion_tokens: 1,
        messages:
        [ 
            {
                content: `You are a helpful assistant that grades an impact case study section. You exclusively return one of the following grades: ${Object.values(Grades).join(", ")}.`,
                role: "system",
            },
            {
                content: `${title}: ${chapter}`,
                role: "user"
            }
        ],
        model: OPENAI_MODEL,
        response_format:
        {
            json_schema:
            {
                name: "grade",
                schema:
                {
                    properties:
                    {
                        grade:
                        {
                            description: `The grade for the '${title}' section`,
                            enum: Object.values(Grades),
                            type: "string"
                        }
                    },
                    required:
                    [
                        "grade"
                    ],
                    type: "object"
                }
            },
            type: "json_schema"
        },
        seed: 1
    };
    const {choices: [{message: {content, refusal}}]} = await openai.chat.completions.create(request);
    if(refusal === null)
    {
        try
        {
            return JSON.parse(content ?? "null") as {grade: typeof Grades[keyof typeof Grades] | null};
        }
        catch(error)
        {
            console.error("OpenAI returned invalid JSON", error);
            return null;
        }
    }
    else
    {
        console.error("OpenAI refused to grade the section", refusal);
        return null;
    }
}
