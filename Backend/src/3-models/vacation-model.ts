import { UploadedFile } from "express-fileupload";

export interface VacationModel {
    vacationId?: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageName?: string;
    image?: UploadedFile;
}