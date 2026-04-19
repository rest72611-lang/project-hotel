export interface VacationModel {
    vacationId: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: string;
    imageName: string;
    likesCount: number;
    isLiked: number;
    image?: FileList;
}