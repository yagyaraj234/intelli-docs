import { StringOutputParser } from "@langchain/core/output_parsers";
import { Request, Response } from "express";
import { db } from "../index";
import { groqModel } from "../utils/langchain/model";
import { createHistory, prompt } from "../utils/langchain/prompts";
import { ApiError } from "../utils/response/error";
import { ApiSuccess } from "../utils/response/success";

export const generate = async (req: Request, res: Response) => {
  const { message, workspaceId, uid } = req.body;
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
    const { history = [] } = workspaceRef.data();
    const ChatHistory = await createHistory(history);
    const chain = prompt.pipe(groqModel).pipe(new StringOutputParser());

    const response = await chain.stream({
      input: message,
      chat_history: ChatHistory,
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
