import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateWorkspaceForm({
  isOpen,
  onClose,
  onCreateWorkspace,
}: any) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceRole, setWorkspaceRole] = useState("general");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onCreateWorkspace({ name: workspaceName, role: workspaceRole, youtubeUrl });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Set up a new workspace and choose its primary role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="col-span-3"
                placeholder="Linkedin lead generation"
              />
            </div>
            <RadioGroup
              value={workspaceRole}
              onValueChange={setWorkspaceRole}
              className="grid grid-cols-2 grid-rows-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">General Chat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="code" id="code" />
                <Label htmlFor="code">Programmer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" disabled />
                <Label htmlFor="pdf">PDF Analysis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="youtube" id="youtube" disabled />
                <Label htmlFor="youtube">YouTube Video Chat</Label>
              </div>
            </RadioGroup>
            {workspaceRole === "youtube" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="youtube-url" className="text-right">
                  YouTube URL
                </Label>
                <Input
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create Workspace</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
