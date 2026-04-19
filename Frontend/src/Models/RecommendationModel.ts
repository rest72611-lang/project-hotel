export interface RecommendationItemModel {
    name: string;
    description: string;
    highlights: string[];
    tip: string;
}

export interface RecommendationModel {
    title: string;
    intro: string;
    recommendations: RecommendationItemModel[];
}