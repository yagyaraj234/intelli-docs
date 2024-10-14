"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteWorkspace } from "@/services/workspace/index";
import { useWorkspace } from "@/hooks/use-workspace";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function WorkspaceMenu({ workspaceId }: { workspaceId: string }) {
  const { workspaces, setWorkspaces } = useWorkspace();
  async function handleDelete() {
    const res = await deleteWorkspace(workspaceId);
    if (res.status === "success") {
      const newWorkspaces = workspaces.filter(
        (workspace: any) => workspace.id !== workspaceId
      );
      setWorkspaces(newWorkspaces);
    } else {
      toast.error(res.message);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis size={20} className="opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-2 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash size={16} /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
