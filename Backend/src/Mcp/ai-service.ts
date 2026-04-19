import OpenAI from "openai";
import { vacationsService } from "../4-services/vacations-service";
import z from "zod";

class AiService {

    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    public async askQuestion(userId: number, question: string): Promise<string> {

        const tools = [
            {
                type: "function" as const,
                function: {
                    name: "getAllVacations",
                    description: "Get all vacations for the current logged in user.",
                    parameters: {
                        type: "object",
                        properties: {},
                        required: [],
                        additionalProperties: false
                    }
                }
            },
            {
                type: "function" as const,
                function: {
                    name: "getVacationById",
                    description: "Get one vacation by its id.",
                    parameters: {
                        type: "object",
                        properties: {
                            vacationId: { type: "number" }
                        },
                        required: ["vacationId"],
                        additionalProperties: false
                    }
                }
            }
        ];

        const messages: any[] = [
            {
                role: "system",
                content: "You are a vacations assistant. Use only the available tools when needed. Answer in Hebrew."
            },
            {
                role: "user",
                content: question
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
            return "לא התקבלה תשובה.";
        }

        const toolCalls = assistantMessage.tool_calls;

        if (!toolCalls || toolCalls.length === 0) {
            return assistantMessage.content || "לא התקבלה תשובה.";
        }

        messages.push(assistantMessage);

        for (const toolCall of toolCalls) {
            if (toolCall.type !== "function") continue;

            const toolName = toolCall.function.name;
            let toolResult = "Tool failed.";

            if (toolName === "getAllVacations") {
                const vacations = await vacationsService.getAllVacations(userId);
                toolResult = JSON.stringify(vacations, null, 2);
            }
            else if (toolName === "getVacationById") {
                let parsedArgs: { vacationId: number };

                try {
                    const rawArgs = JSON.parse(toolCall.function.arguments || "{}");
                    parsedArgs = z.object({
                        vacationId: z.number()
                    }).parse(rawArgs);
                }
                catch {
                    toolResult = JSON.stringify({ error: "Invalid vacationId" });
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: toolResult
                    });
                    continue;
                }

                const vacation = await vacationsService.getOneVacation(parsedArgs.vacationId);
                toolResult = JSON.stringify(vacation, null, 2);
            }

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

        return finalResponse.choices?.[0]?.message?.content || "לא התקבלה תשובה.";
    }
}

export const aiService = new AiService();