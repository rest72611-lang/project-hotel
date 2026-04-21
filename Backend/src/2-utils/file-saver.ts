import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";

// Keeps image file persistence separate from vacation business logic.
class FileSaver {

    private readonly imagesFolder = path.join(__dirname, "../../src/1-assets/images");

    public async saveImage(image: UploadedFile): Promise<string> {
        if (!fs.existsSync(this.imagesFolder)) {
            fs.mkdirSync(this.imagesFolder, { recursive: true });
        }

        const extension = path.extname(image.name);
        // A timestamp + random suffix is enough here to avoid collisions in a single-project environment.
        const imageName = Date.now() + "_" + Math.floor(Math.random() * 1000000) + extension;
        const imagePath = path.join(this.imagesFolder, imageName);

        await image.mv(imagePath);

        return imageName;
    }

    public deleteImage(imageName: string): void {
        const imagePath = path.join(this.imagesFolder, imageName);
        // Delete is intentionally idempotent so repeated cleanup attempts stay harmless.
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
}

export const fileSaver = new FileSaver();
