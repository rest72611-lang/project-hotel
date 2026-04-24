import OpenAI from "openai";
import { z } from "zod";
import { vacationsService } from "../4-services/vacations-service";
import { ValidationError } from "../3-models/client-errors";

const getVacationByIdArgsSchema = z.object({
    vacationId: z.number().int().positive()
});

type ToolName = "getAllVacations" | "getVacationById";

interface FunctionToolCall {
    id: string;
    type: "function";
    function: {
        name: ToolName | string;
        arguments: string;
    };
}

class AiService {

    private readonly systemDataQuestionPatterns = [
        /\bvacation\b/i,
        /\bvacations\b/i,
        /\bmy vacations\b/i,
        /\bvacation id\b/i,
        /\bid\s*\d+\b/i,
        /\bdestination\b/i,
        /\bprice\b/i,
        /\bprices\b/i,
        /\bdate\b/i,
        /\bdates\b/i,
        /\bstart date\b/i,
        /\bend date\b/i,
        /\blike\b/i,
        /\blikes\b/i,
        /\bliked\b/i
    ];

    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    public async askQuestion(userId: number, question: string): Promise<string> {
        const normalizedQuestion = question?.trim();

        if (!normalizedQuestion) {
            throw new ValidationError("Missing question.");
        }

        const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
            {
                type: "function",
                function: {
                    name: "getAllVacations",
                    description: "Get all vacations available to the current logged in user, including likes count and whether the current user liked each vacation.",
                    parameters: {
                        type: "object",
                        properties: {},
                        required: [],
                        additionalProperties: false
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getVacationById",
                    description: "Get one vacation by its numeric id. Use this when the user asks about a specific vacation and you need full vacation details.",
                    parameters: {
                        type: "object",
                        properties: {
                            vacationId: {
                                type: "number",
                                description: "A positive integer vacation id, for example 1."
                            }
                        },
                        required: ["vacationId"],
                        additionalProperties: false
                    }
                }
            }
        ];

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: this.getSystemPrompt()
            },
            {
                role: "user",
                content: normalizedQuestion
            }
        ];

        const firstResponse = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            tools,
            tool_choice: "auto",
            temperature: 0
        });

        const assistantMessage = firstResponse.choices?.[0]?.message;

        if (!assistantMessage) {
            return "No answer was received.";
        }

        const toolCalls = assistantMessage.tool_calls;

        if (!toolCalls || toolCalls.length === 0) {
            if (this.isSystemDataQuestion(normalizedQuestion)) {
                return "I can't verify this from the system data without using a backend tool.";
            }

            return assistantMessage.content || "No answer was received.";
        }

        messages.push(assistantMessage);

        for (const toolCall of toolCalls) {
            if (!this.isFunctionToolCall(toolCall)) {
                continue;
            }

            const toolResult = await this.executeToolCall(userId, toolCall);

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: toolResult
            });
        }

        const finalResponse = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0
        });

        return finalResponse.choices?.[0]?.message?.content || "No answer was received.";
    }

    private getSystemPrompt(): string {
        return `
You are a vacations assistant connected to backend tools.

Strict policy:
- Never invent, guess, assume, or fill in missing application data.
- Never answer questions about application data without tool verification.
- Application data includes vacations, vacation ids, destinations, descriptions, dates, prices, images, likes counts, liked status, and anything related to the logged-in user's stored data.
- For any question about application data, you must call a relevant tool before answering.
- If no relevant tool exists, clearly say that you cannot verify it from the system data.
- If a tool returns an error, explain the error clearly and do not invent data.
- Use only facts returned by tool results for system-specific answers.
- If the user asks a general travel question not dependent on stored application data, you may answer normally.
- Keep answers clear, concise, and in English.

Decision policy:
- Questions about the user's vacations -> use tools first.
- Questions about a specific vacation id -> use tools first.
- Questions about prices, dates, likes, liked status, or destinations from the system -> use tools first.
- General travel advice unrelated to stored app data -> answer normally.
`.trim();
    }

    private async executeToolCall(
        userId: number,
        toolCall: FunctionToolCall
    ): Promise<string> {
        try {
            switch (toolCall.function.name) {
                case "getAllVacations": {
                    const vacations = await vacationsService.getAllVacations(userId);
                    return JSON.stringify(vacations, null, 2);
                }

                case "getVacationById": {
                    const rawArgs = JSON.parse(toolCall.function.arguments || "{}");
                    const { vacationId } = getVacationByIdArgsSchema.parse(rawArgs);
                    const vacation = await vacationsService.getOneVacation(vacationId);
                    return JSON.stringify(vacation, null, 2);
                }

                default:
                    return JSON.stringify({
                        error: `Unknown tool: ${toolCall.function.name}`
                    });
            }
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                return JSON.stringify({ error: "Invalid tool arguments JSON." });
            }

            if (err instanceof z.ZodError) {
                return JSON.stringify({ error: "Invalid tool arguments." });
            }

            if (err instanceof Error) {
                return JSON.stringify({ error: err.message });
            }

            return JSON.stringify({ error: "Tool execution failed." });
        }
    }

    private isFunctionToolCall(toolCall: unknown): toolCall is FunctionToolCall {
        if (!toolCall || typeof toolCall !== "object") {
            return false;
        }

        const candidate = toolCall as {
            id?: unknown;
            type?: unknown;
            function?: {
                name?: unknown;
                arguments?: unknown;
            };
        };

        return candidate.type === "function"
            && typeof candidate.id === "string"
            && typeof candidate.function?.name === "string"
            && typeof candidate.function?.arguments === "string";
    }

    private isSystemDataQuestion(question: string): boolean {
        return this.systemDataQuestionPatterns.some(pattern => pattern.test(question));
    }
}

export const aiService = new AiService();
