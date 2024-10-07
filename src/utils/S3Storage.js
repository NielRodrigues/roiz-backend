/* eslint-disable import/no-extraneous-dependencies */
import fs from "fs";
import path from "path";
import mime from "mime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { fromIni } from "@aws-sdk/credential-provider-ini";
import "dotenv/config";

class S3Storage {
  constructor() {
    this.client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: "keyId",
        secretAccessKey: "secret",
      },
    });
  }

  async saveFile(filename) {
    const originalPath = path.resolve(
      __dirname,
      "..",
      "..",
      "tmp",
      "uploads",
      filename
    );

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error("File not found");
    }

    const fileContent = await fs.promises.readFile(originalPath);

    try {
      const command = new PutObjectCommand({
        Bucket: "roiz-images",
        Key: filename,
        ACL: "public-read",
        Body: fileContent,
        ContentType: contentType,
      });

      await this.client.send(command);

      await fs.promises.unlink(originalPath);
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  }
}

export default S3Storage;
