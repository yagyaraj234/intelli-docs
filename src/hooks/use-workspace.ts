import { create } from "zustand";

interface workspaceState {
  email: string;
  id: string;
}

interface workspacesState {
  workspaces: workspaceState[];
}

interface chat {
  id: string;
  message: string;
  createdAt: string;
  type: "user" | "bot";
}

interface currentWorkspaceState {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  files: string[];
  chats: chat[];
}

export const useWorkspace = create((set) => ({
  workspaces: [],
  workspace: null,
  setWorkspaces: (workspaces: workspacesState | null) => set({ workspaces }),
  setCurrentWorkspace: (workspace: currentWorkspaceState | null) =>
    set({ workspace }),
}));
