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

export type Type = "pdf" | "text";

export type Result =
{
    [K in typeof Titles[number]]: typeof Grades[keyof typeof Grades]
};