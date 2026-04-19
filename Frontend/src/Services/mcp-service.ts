import axios from "axios";
import { appConfig } from "../Utils/AppConfig";


class AiFrontService {

    public async askVacationsQuestion(userId: number, question: string): Promise<string> {
        const response = await axios.post<string>(
            appConfig.aiAskUrl,
            {
                userId,
                question
            },
            {
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            }
        );

        return response.data;
    }
}

export const aiFrontService = new AiFrontService();