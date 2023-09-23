import UploadImageS3 from "../../services/UploadImageS3";
import File from "../models/File";
import "dotenv/config";

class FilesController {
  async create(request, response) {
    const { originalname, filename } = request.file;

    const uploadImageS3 = new UploadImageS3();

    await uploadImageS3.execute(filename);

    const file = await File.create({ name: originalname, path: filename });

    return response.status(201).json(file);
  }
}

export default new FilesController();
