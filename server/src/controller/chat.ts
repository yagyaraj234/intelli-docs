import { StringOutputParser } from "@langchain/core/output_parsers";
import { Request, Response } from "express";
import { db } from "../index";
import { claudeModel, groqModel } from "../utils/langchain/model";
import { createHistory, getPrompt } from "../utils/langchain/prompts";
import { ApiError } from "../utils/response/error";
import { ApiSuccess } from "../utils/response/success";
import { retrieveFromVectorStore } from "../utils/langchain/emedding";
import { pineconeInstance } from "../index";

export const generate = async (req: Request, res: Response) => {
  const { message, workspaceId, uid, plan } = req.body;
  if (!message) {
    return res.status(400).json(ApiError("Message is required", 400));
  }

  try {
    const workspaceRef = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces")
      .doc(workspaceId)
      .get();

    if (!workspaceRef.exists) {
      return res.status(500).json(ApiError("Workspace doesn't exists", 404));
    }
    // @ts-ignore
    const { history = [], role } = workspaceRef.data();
    const ChatHistory = await createHistory(history);
    let chain;
    const prompt = await getPrompt(role);
    if (!plan) {
      chain = prompt.pipe(groqModel).pipe(new StringOutputParser());
    } else {
      chain = prompt.pipe(claudeModel).pipe(new StringOutputParser());
    }

    const context = await retrieveFromVectorStore(
      pineconeInstance,
      message,
      workspaceId
    );
    console.log("context", context);

    const response = await chain.stream({
      input: message,
      chat_history: ChatHistory,
      context: context,
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    for await (const chunk of response) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    res.status(500).json(ApiError(error.message, 500, error.details));
  }
};

export const updateChat = async (req: Request, res: Response) => {
  const { uid, workspaceId, messages } = req.body;

  try {
    const workspaceRef = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces")
      .doc(workspaceId);

    const workspaceDoc = await workspaceRef.get();
    if (!workspaceDoc.exists) {
      return res.json(ApiError("Workspace doesn't exists", 404));
    }
    // @ts-ignore
    const { history = [] } = workspaceDoc.data();

    await workspaceRef.update({
      history: [...history, ...messages],
    });

    return res.json(ApiSuccess("Chat updated successfully", messages));
  } catch (error) {
    console.log(error);
    return res.json(ApiError("Internal server error", 500, error));
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { uid, workspaceId, id } = req.body;

  try {
    const workspaceRef = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces")
      .doc(workspaceId);

    const workspaceDoc = await workspaceRef.get();
    if (!workspaceDoc.exists) {
      return res.json(ApiError("Workspace doesn't exists", 404));
    }

    let history = workspaceDoc.data()?.history || [];

    history = history.filter((item: any) => item.id !== id);

    await workspaceRef.update({
      history: history,
    });

    return res.json(ApiSuccess("Chat deleted successfully", history));
  } catch (error) {
    console.log(error);
    return res.json(ApiError("Internal server error", 500, error));
  }
};

export const clearChat = async (req: Request, res: Response) => {
  const { uid, workspaceId } = req.body;

  try {
    const workspaceRef = await db
      .collection("users")
      .doc(uid)
      .collection("workspaces")
      .doc(workspaceId);

    const workspaceDoc = await workspaceRef.get();
    if (!workspaceDoc.exists) {
      return res.json(ApiError("Workspace doesn't exists", 404));
    }

    await workspaceRef.update({
      history: [],
    });

    return res.json(ApiSuccess("Chat cleared successfully", []));
  } catch (error) {
    console.log(error);
    return res.json(ApiError("Internal server error", 500, error));
  }
};
