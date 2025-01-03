import {OpenAI} from "openai";

const Grades =
{
    0.0: "Fail" as const,
    0.5: "Fail" as const,
    1.0: "Fail" as const,
    1.5: "Marginal" as const,
    2.0: "Passable" as const,
    2.5: "Satisfactory" as const,
    3.0: "Good" as const,
    3.5: "Superior" as const,
    4.0: "Excellent" as const
};

const Titles =
[
    "Summary of the impact",
    "Underpinning research",
    "References to the research",
    "Details of the impact"
];

const {OPENAI_API_KEY, OPEANAI_MODEL} = process.env;
if(OPENAI_API_KEY === undefined || OPEANAI_MODEL === undefined)
{
    throw new Error("missing environment variables");
}

const openai = new OpenAI({apiKey: OPENAI_API_KEY});

const chapter = "The research has been used to develop a new type of solar panel that is 20% more efficient than the previous model. This has led to a 30% increase in the number of solar panels installed in the UK, resulting in a 10% reduction in carbon emissions. The research has also been used to develop a new type of battery that is 50% more efficient than the previous model. This has led to a 20% increase in the number of electric vehicles on the road, resulting in a 5% reduction in carbon emissions.";
const title = Titles[Math.floor(Math.random() * Titles.length)];
const result = await openai.chat.completions.create(
{
    max_completion_tokens: 1,
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
    model: OPEANAI_MODEL,
    seed: 1
});