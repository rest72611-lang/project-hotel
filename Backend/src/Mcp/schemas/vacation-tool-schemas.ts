import z from "zod";

// Shared schemas for MCP-facing vacation tools. Keeping them here avoids duplicating contract rules.
export const GetAllVacationsInputSchema = z.object({
    userId: z.number().int().positive()
});

export const GetVacationByIdInputSchema = z.object({
    vacationId: z.number().int().positive()
});

export const GetVacationsReportInputSchema = z.object({
    userId: z.number().int().positive()
});

export const AskAiQuestionInputSchema = z.object({
    userId: z.number().int().positive(),
    question: z.string().min(2).max(500)
});
