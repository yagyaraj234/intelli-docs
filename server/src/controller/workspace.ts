import { Request, Response } from "express";

import { db } from "../index";
import { ApiError } from "../utils/response/error";
import { ApiSuccess } from "../utils/response/success";

import { workspaceSchema } from "../types/zod-schema";
import { uploadFile } from "../utils/storage/storage";

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const createWorkspace = async (req: Request, res: Response) => {
  const { uid } = req.body;
  try {
    const { name, role, url } = workspaceSchema.parse(req.body);

    if (!name || !role) {
      return res.status(400).json(ApiError("Name and role are required", 400));
    }

    const userRef = await db.collection("users").doc(uid);

    const workspaces = await userRef.collection("workspaces").get();

    if (workspaces.size >= 3) {
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
  const { id, uid } = req.body;
  try {
    const userRef = db.collection("users").doc(uid).collection("workspaces");

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
  if (!req.files) {
    return res.json(ApiError("Failed to upload", 400));
  }

  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json(ApiError("No files uploaded", 400));
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
      uploadFile(file)
    );
    const results = await Promise.all(uploadPromises);

    res.status(200).json(ApiSuccess("Files uploaded successfully", results));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};

export const temporaryWorkspace = async (req: Request, res: Response) => {
  const id: string = generateId();

  const data = {
    id: id || "kjfnjsfdn",
    name: "My Workspace",
    role: "general",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.collection("temporary_workspaces").doc(id).set(data);
    return res
      .status(200)
      .json(ApiSuccess("Workspace created successfully", data));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};
