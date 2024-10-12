import { Request, Response } from "express";

import { db, pineconeInstance } from "../index";
import { ApiError } from "../utils/response/error";
import { ApiSuccess } from "../utils/response/success";

import { workspaceSchema } from "../types/zod-schema";
import { uploadFile, deleteDoc } from "../utils/storage/storage";
import { jinaLoader } from "../utils/langchain/document-loader";

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const createWorkspace = async (req: Request, res: Response) => {
  const { uid, plan } = req.body;
  try {
    const { name, role, url } = workspaceSchema.parse(req.body);

    if (!name || !role) {
      return res.status(400).json(ApiError("Name and role are required", 400));
    }

    const userRef = await db.collection("users").doc(uid);

    const workspaces = await userRef.collection("workspaces").get();

    if (workspaces.size >= 3 && !plan) {
      return res.status(400).json(ApiError("You have reached the limit.", 400));
    }

    const id = generateId();

    const date = new Date().toISOString();
    const data = {
      id,
      name,
      role,
      url: url || "",
      history: [],
      createdAt: date,
      updatedAt: date,
    };
    await userRef.collection("workspaces").doc(id).set(data);

    return res
      .status(201)
      .json(ApiSuccess("Workspace created successfully", data));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  try {
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces");

    const workspaces = await userRef.get();

    if (workspaces.size <= 1) {
      return res
        .status(400)
        .json(ApiError("You must have at least one workspace", 400));
    }

    await userRef.doc(id).delete();

    return res
      .status(200)
      .json(ApiSuccess("Workspace deleted successfully", {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const getAllWorkspaces = async (req: Request, res: Response) => {
  const { uid } = req.body;
  try {
    const userRef = db.collection("users").doc(uid);
    const workspaces = await userRef.collection("workspaces").get();

    const data: { id: string; name: string }[] = [];
    workspaces.forEach((doc: any) => {
      const { id, name, role } = doc.data();
      // @ts-ignore
      data.push({ id, name, role });
    });

    return res.status(200).json(ApiSuccess("Workspaces fetched", data));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const getWorkspace = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  try {
    const userRef = db.collection("users").doc(uid);
    const workspace = await userRef.collection("workspaces").doc(id).get();

    if (!workspace.exists) {
      return res.status(404).json(ApiError("Workspace not found", 404));
    }
    const data = workspace.data();

    return res.status(200).json(ApiSuccess("Workspace fetched", data));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const { uid, name, role, url } = req.body;
  const { id } = req.params;

  try {
    const userRef = db.collection("users").doc(uid);
    const workspace = await userRef.collection("workspaces").doc(id).get();

    if (!workspace.exists) {
      return res.status(404).json(ApiError("Workspace not found", 404));
    }

    await userRef.collection("workspaces").doc(id).update({ name, role, url });

    return res
      .status(200)
      .json(ApiSuccess("Workspace updated successfully", {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const attachFile = async (req: Request, res: Response) => {
  const { uid, id } = req.body;

  if (!uid || !id) {
    return res
      .status(400)
      .json(ApiError("User ID and Workspace ID are required", 400));
  }

  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json(ApiError("No files uploaded", 400));
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(
      async (file) => await uploadFile(file, uid)
    );
    const results = await Promise.all(uploadPromises);

    for (const result of results) {
      jinaLoader(result.url, pineconeInstance, result.name, id);
    }

    const ref = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces")
      .doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json(ApiError("Workspace not found", 404));
    }

    const data = await doc.data();
    // @ts-ignore
    const files = [...(data.files || []), ...results];

    await ref.update({ files });
    res.status(200).json(ApiSuccess("Files uploaded successfully", results));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id, fileId } = req.params;

    const { uid } = req.body;

    const ref = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces")
      .doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json(ApiError("Workspace not found", 404));
    }

    const { files } = (await doc.data()) || { files: [] };

    const fileName = files.find((file: any) => file.id === fileId).name;
    await deleteDoc(`${uid}/${fileName}`);

    const updatedFiles = files.filter((file: any) => file.id !== fileId);

    await ref.update({ files: updatedFiles });

    res.status(200).json(ApiSuccess("File deleted successfully", updatedFiles));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};
