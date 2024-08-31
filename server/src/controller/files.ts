// @ts-nocheck
import { Request, Response } from "express";

let db: any;

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { files } = req.files;
    const { name, size, mimetype } = file;
    const { id } = req.user;

    const fileRef = db.collection("files").doc();
    const fileData = {
      id: fileRef.id,
      name,
      size,
      mimetype,
      userId: id,
      createdAt: new Date(),
    };

    await fileRef.set(fileData);

    return res.status(201).json({
      status: "success",
      message: "File uploaded successfully",
      data: fileData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};
