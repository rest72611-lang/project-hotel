import OpenAI from "openai";
import { ValidationError } from "../3-models/client-errors";

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
            const json = this.sanitize(response.output_text);
            return JSON.parse(json);
        }
        catch {
            throw new ValidationError("AI returned invalid JSON.");
        }
    }

    private getSystemContent(destination: string): string {
        return "You are a professional travel guide and vacation recommendation expert for the destination: " + destination;
    }

    private getUserContent(destination: string): string {
        return `
Create a travel recommendation for the destination: ${destination}.

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
        const start = completion.indexOf("{");
        const end = completion.lastIndexOf("}");
        return completion.substring(start, end + 1);
    }
}

export const recommendationService = new RecommendationService();