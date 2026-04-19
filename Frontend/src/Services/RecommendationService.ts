import { RecommendationModel } from "../Models/RecommendationModel";
import { api } from "./Service";
import { appConfig } from "../Utils/AppConfig";

class RecommendationService {

    public async getRecommendation(destination: string): Promise<RecommendationModel> {
        const response = await api.post<RecommendationModel>(appConfig.recommendationsUrl, {
            destination
        });

        return response.data;
    }
}

export const recommendationService = new RecommendationService();