import S3Storage from "../utils/S3Storage";
import "dotenv/config";

class UploadImageS3 {
  async execute(filename) {
    const s3Storage = new S3Storage();

    await s3Storage.saveFile(filename);
  }
}

export default UploadImageS3;
