import { bucket } from "../../index";
import { v4 as uuidv4 } from "uuid";



export async function uploadFile(
  file: Express.Multer.File,
  customFileName?: string
): Promise<{ fileName: string; downloadUrl: string }> {
  const fileName = customFileName || `${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      id: uuidv4(),
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => reject(error));
    blobStream.on("finish", async () => {
      // Make the file publicly readable
      await fileUpload.makePublic();

      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      resolve({
        fileName: fileUpload.name,
        downloadUrl: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  });
}

export async function deleteFile(fileName: string): Promise<void> {
  const file = bucket.file(fileName);

  try {
    await file.delete();
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    throw error;
  }
}
