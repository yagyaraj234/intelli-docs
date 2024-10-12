import { create } from "zustand";

interface workspaceState {
  email: string;
  id: string;
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
  files: any[];
  history: chat[];
  role: string;
}

interface storeState {
  workspaces: workspaceState[];
  workspace: currentWorkspaceState | null;
  setWorkspaces: (workspaces: workspaceState[]) => void;
  setCurrentWorkspace: (workspace: currentWorkspaceState) => void;
}

export const useWorkspace = create<storeState>((set) => ({
  workspaces: [],
  workspace: null,
  setWorkspaces: (workspaces: workspaceState[]) => set({ workspaces }),
  setCurrentWorkspace: (workspace: currentWorkspaceState | null) =>
    set({ workspace }),
}));
