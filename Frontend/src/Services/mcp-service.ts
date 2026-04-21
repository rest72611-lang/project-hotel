import { appConfig } from "../Utils/AppConfig";
import { api } from "./Service";

// Reuses the shared API client so MCP requests follow the same auth flow as the rest of the app.
class AiFrontService {

    public async askVacationsQuestion(question: string): Promise<string> {
        const response = await api.post<string>(
            appConfig.aiAskUrl,
            {
                question
            },
            {
                headers: {
                    // Helps when the endpoint is exposed through ngrok during demos.
                    "ngrok-skip-browser-warning": "true"
                }
            }
        );

        return response.data;
    }
}

export const aiFrontService = new AiFrontService();
