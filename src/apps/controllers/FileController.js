import File from "../models/File";

class FilesController {
  async create(request, response) {
    const { originalname, filename } = request.file;

    const file = await File.create({ name: originalname, path: filename });

    return response.status(201).json(file);
  }
}

export default new FilesController();
