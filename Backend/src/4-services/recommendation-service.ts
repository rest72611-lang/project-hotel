import OpenAI from "openai";
import { ValidationError } from "../3-models/client-errors";

// Wraps the AI call behind a strict JSON contract so the frontend receives render-ready data.
class RecommendationService {
    private openai: OpenAI;

    public constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    public async getRecommendation(destination: string): Promise<any> {
        if (!destination || !destination.trim()) {
            throw new ValidationError("Missing destination.");
        }

        const systemContent = this.getSystemContent(destination);
        const userContent = this.getUserContent(destination);

        const response = await this.openai.responses.create({
            model: "gpt-5.4",
            input: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent }
            ]
        });

        try {
            // The model is instructed to return JSON, but we still defensively sanitize before parsing.
            const json = this.sanitize(response.output_text);
            return JSON.parse(json);
        }
        catch {
            throw new ValidationError("AI returned invalid JSON.");
        }
    }

    private getSystemContent(destination: string): string {
        return `
You are a professional travel guide and vacation recommendation expert.

Your task is to generate a high-quality travel recommendation for the destination "${destination}".

Rules:
- Return valid JSON only.
- Do not add markdown, bullet prefixes, commentary, or code fences.
- The JSON must exactly match the required shape.
- Write in clear, natural English.
- Keep recommendations practical, specific, and traveler-friendly.
- Prefer real attractions, neighborhoods, activities, or day-trip ideas strongly associated with the destination.
- Avoid repeating the same idea in different wording.
- Every recommendation must feel distinct.
- Keep each description concise but informative.
- Each highlights array must contain exactly 3 short items.
- Each tip must be actionable and useful.
- If the destination is broad or ambiguous, still provide the best mainstream travel interpretation.
- If you are unsure, avoid inventing niche facts and stay with high-confidence travel suggestions.
`.trim();
    }

    private getUserContent(destination: string): string {
        return `
Create a travel recommendation for the destination: ${destination}.

Quality requirements:
- Generate exactly 3 recommendation items.
- Make the title sound polished and destination-specific.
- Make the intro 1-2 sentences long.
- For each recommendation item:
  - "name" should be short and specific.
  - "description" should explain why it is worth visiting.
  - "highlights" should contain exactly 3 compact highlights.
  - "tip" should help the traveler plan better.
- Keep the content useful for a real traveler, not generic filler.

Return the answer ONLY in the following JSON format:

{
  "title": "destination vacation recommendations",
  "intro": "short intro about the destination",
  "recommendations": [
    {
      "name": "place or activity name",
      "description": "short explanation",
      "highlights": [
        "highlight 1",
        "highlight 2",
        "highlight 3"
      ],
      "tip": "useful travel tip"
    },
    {
      "name": "place or activity name",
      "description": "short explanation",
      "highlights": [
        "highlight 1",
        "highlight 2",
        "highlight 3"
      ],
      "tip": "useful travel tip"
    },
    {
      "name": "place or activity name",
      "description": "short explanation",
      "highlights": [
        "highlight 1",
        "highlight 2",
        "highlight 3"
      ],
      "tip": "useful travel tip"
    }
  ]
}
`;
    }

    private sanitize(completion: string): string {
        // Extract the outermost JSON object in case the model wraps it with explanatory text.
        const start = completion.indexOf("{");
        const end = completion.lastIndexOf("}");
        return completion.substring(start, end + 1);
    }
}

export const recommendationService = new RecommendationService();
