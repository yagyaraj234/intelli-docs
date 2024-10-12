import fs from "fs";
import path from "path";
import { bucket } from "../../index";
import { v4 as uuidv4 } from "uuid";

export async function uploadFile(
  file: Express.Multer.File,
  uid?: string,
  workspaceId?: string
): Promise<{
  name: string;
  url: string;
  createdAt: string;
  id: string;
  size: string;
}> {
  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
    contentType: file.mimetype,
    cacheControl: "public, max-age=31536000",
  };

  const blob = bucket.file(`${uid}/${file.originalname}`);
  let size: string;
  if (file.size > 1024 * 1024) {
    size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    size = (file.size / 1024).toFixed(2) + ' KB';
  }
  const blobStream = blob.createWriteStream({
    metadata,
    gzip: true,
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error: any) => {
      reject(error);
    });
    const id = uuidv4()?.slice(0, 6);

    blobStream.on("finish", async () => {
      const newUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(blob.name)}?alt=media&token=${
        metadata.metadata.firebaseStorageDownloadTokens
      }`;

      const createdAt = new Date().toISOString();
      resolve({
        name: blob.name.split("/")[1],
        url: newUrl,
        createdAt,
        id,
        size: size.toString(),
      });
    });
    blobStream.end(file.buffer);
  });
}

export async function deleteDoc(filePath: string): Promise<void> {
  if (!bucket) {
    throw new Error("Storage bucket is not initialized");
  }

  const file = bucket.file(filePath);

  if (!file) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    await file.delete();
    console.log(`File ${filePath} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    throw error;
  }
}

export async function addPDFLocally(
  files: Express.Multer.File[]
): Promise<{ name: string; url: string; type: string }[]> {
  const filePromises = files.map((file) => {
    return new Promise<{ name: string; url: string; type: string }>(
      (resolve, reject) => {
        // Generate the file path where the PDF will be stored
        const filePath = path.join(
          __dirname,
          `../../uploads/${file.originalname}`
        );

        const fileExtension = file.originalname.split(".").pop();

        // Move the file to the specified path
        fs.rename(file.path, filePath, (err) => {
          if (err) {
            console.error("File upload failed:", err);
            return reject(err); // Reject the promise if there's an error
          }

          console.log("File uploaded successfully");

          // Resolve the promise with file details
          resolve({
            name: file.originalname,
            url: filePath,
            type: fileExtension || "",
          });
        });
      }
    );
  });

  // Wait for all file operations to complete
  return Promise.all(filePromises);
}

export function deleteFileLocally(filePath: string): void {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("File deletion failed:", err);
      return;
    }
    console.log("File deleted successfully");
  });
}
