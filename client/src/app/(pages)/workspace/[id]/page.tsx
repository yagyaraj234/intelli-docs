// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FileIcon,
  SendIcon,
  UploadIcon,
  PlusIcon,
  CodeIcon,
  FileTextIcon,
  YoutubeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
  Copy,
} from "lucide-react";
import { CreateWorkspaceForm } from "@/components/workspaces/workspace-form";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspace,
} from "@/services/workspace";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";
import { UpgradePopup } from "@/components/plan/upgrade-pop";
import RightPanel from "./_component/rightPanel";
import { Card } from "@/components/ui/card";
import { loadMarkdown } from "@/utils/markdown";
import { ChatLoader } from "./_component/chat-loader";
import { streamChat } from "@/services/chat/chat";
import { Chat } from "./_component/chat-model";
import { useUser } from "@/hooks/use-user";

export default function ChatWorkspace() {
  const {
    workspace: currentWorkspace,
    workspaces,
    setWorkspaces,
    setCurrentWorkspace,
  } = useWorkspace();
  const { plan } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showUpgradeWorkspace, setShowUpgradeWorkspace] = useState(false);
  const [showCreateWorkspaceForm, setShowCreateWorkspaceForm] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [generating, setGenerating] = useState<boolean>(false);

  const id = useParams().id;
  const router = useRouter();

  const getWorkspaces = async () => {
    if (workspaces.length > 0) return;
    try {
      const res = await getAllWorkspaces();

      if (res.status === "success") {
        setWorkspaces(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWorkspaceById = async (id) => {
    try {
      const res = await getWorkspace(id);

      if (res.status === "success") {
        console.log("success reach");
        setCurrentWorkspace(res.data);
        setMessages(res.data.history);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWorkspaces();
    getWorkspaceById(id);
  }, []);

  const handleCreateWorkspace = async (workspaceData) => {
    const payload = {
      name: workspaceData.name,
      role: workspaceData.role,
      url: workspaceData.youtubeUrl || "",
    };

    const response = await createWorkspace(
      payload.name,
      payload.role,
      payload.url
    );

    if (response.status === "success") {
      setWorkspaces([...workspaces, response.data]);
      setCurrentWorkspace(response.data);
      toast.success(response.message);

      return;
    }

    toast.error(response.message);
  };

  const switchWorkspace = (workspace) => {
    router.push(`/workspace/${workspace.id}`);
  };

  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);

  const renderIcon = (type) => {
    console.log(type);
    type = type?.toLowerCase();
    switch (type) {
      case "code":
        return <CodeIcon />;
      case "File discussion":
        return <FileTextIcon />;
      case "youtube":
        return <YoutubeIcon />;
      default:
        return <FileIcon />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <UpgradePopup
        isOpen={showUpgradeWorkspace}
        onClose={() => setShowUpgradeWorkspace(false)}
      />
      <Toaster position="top-right" closeButton />
      {/* Left Sidebar */}
      <div
        className={`bg-gray-100 transition-all duration-300 ease-in-out ${
          leftSidebarOpen ? "w-64 max-sm:w-32" : "w-0"
        } lg:relative absolute z-10 h-full `}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-2 -mr-8 bg-white shadow-md rounded-r-full"
          onClick={toggleLeftSidebar}
        >
          {leftSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Button>
        {leftSidebarOpen && (
          <div className="p-4 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-4">Workspaces</h2>
              <Button
                className="w-full mb-4"
                onClick={() => {
                  if (workspaces.length > 3) {
                    setShowUpgradeWorkspace(true);
                    return;
                  }
                  setShowCreateWorkspaceForm(true);
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                <h1 className="max-sm:hidden">New Workspace</h1>
              </Button>
              <ScrollArea className="h-[calc(100vh-240px)] scrollbar scrollbar-none">
                <div className="space-y-2">
                  {workspaces.map((workspace) => (
                    <Button
                      key={workspace.id}
                      variant={id === workspace.id ? "outline" : "link"}
                      className="w-full justify-start gap-4 truncate"
                      onClick={() => switchWorkspace(workspace)}
                    >
                      {renderIcon(workspace.role)}
                      {workspace.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {plan !== "free" && (
                <Card className="flex justify-center items-center p-2 flex-col gap-2 border border-black">
                  <div className="flex gap-2">
                    <h1 className="flex gap-4 text-clip font-bold text-xl">
                      Workbot
                    </h1>
                    <div className="uppercase text-[14px] bg-gradient-to-r to-[#A83279] from-[#D38312] px-2 py-1 rounded-full text-sm text-white">
                      Pro 💎
                    </div>
                  </div>
                  <p className="text-sm">Unlock 10x more features</p>
                  <Button className="w-full cursor-not-allowed" disabled>
                    See Details
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <Chat />
      {/* Right Sidebar */}
      <div
        className={`bg-gray-100 transition-all duration-300 ease-in-out ${
          rightSidebarOpen ? "w-64 max-sm:hidden" : "w-0"
        } lg:relative absolute right-0 z-10 h-full`}
      >
        {rightSidebarOpen && <RightPanel />}
      </div>
      <CreateWorkspaceForm
        isOpen={showCreateWorkspaceForm}
        onClose={() => setShowCreateWorkspaceForm(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  );
}
