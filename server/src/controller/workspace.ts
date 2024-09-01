import { Request, Response } from "express";
// import { nanoid } from "nanoid";

import { db } from "../index";
import { ApiError } from "../utils/response/error";
import { ApiSuccess } from "../utils/response/success";

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const createWorkspace = async (req: Request, res: Response) => {
  const { name, role, url, uid } = req.body;
  try {
    const userRef = await db.collection("users").doc(uid);

    const workspaces = await userRef.collection("workspaces").get();

    if (workspaces.size >= 5) {
      return res.status(400).json(ApiError("You have reached the limit.", 400));
    }

    const id = generateId();

    const date = new Date().toISOString();
    const data = {
      id,
      name,
      role,
      url: url || "",
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
  const { user, id, uid } = req.body;
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
  const { user, uid } = req.body;
  try {
    const userRef = await db.collection("users").doc(uid);
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
    const userRef = await db.collection("users").doc(uid);
    const workspace = await userRef.collection("workspaces").doc(id).get();

    if (!workspace.exists) {
      return res.status(404).json(ApiError("Workspace not found", 404));
    }

    return res
      .status(200)
      .json(ApiSuccess("Workspace fetched", workspace.data()));
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};
