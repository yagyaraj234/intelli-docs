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

export default function ChatWorkspace() {
  const {
    workspace: currentWorkspace,
    workspaces,
    setWorkspaces,
    setCurrentWorkspace,
  } = useWorkspace();
  const [messages, setMessages] = useState([
    { type: "user", content: "This is test" },
    {
      type: "bot",
      content: `__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You will like those projects!`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showUpgradeWorkspace, setShowUpgradeWorkspace] = useState(false);
  const [showCreateWorkspaceForm, setShowCreateWorkspaceForm] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
        setCurrentWorkspace(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWorkspaces();
    getWorkspaceById(id);
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { type: "user", content: inputMessage }]);
      // Here you would typically send the message to your backend for processing
      setInputMessage("");
    }
  };

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
          leftSidebarOpen ? "w-64" : "w-0"
        } lg:relative absolute z-10 h-full`}
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
                New Workspace
              </Button>
              <ScrollArea className="h-[calc(100vh-240px)]">
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

              <Card className="flex justify-center items-center p-2 flex-col gap-2">
                <div className="flex gap-2">
                  <h1 className="flex gap-4 text-clip font-bold text-xl">
                    Workbot
                  </h1>
                  <div className="uppercase text-[14px] bg-purple-700 px-2 py-1 rounded-full text-sm text-white">
                    Pro
                  </div>
                </div>
                <p className="text-sm">Unlock 10x more features</p>
                <Button className="w-full cursor-not-allowed" disabled>
                  See Details
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <ScrollArea className="h-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                {/* <ChatLoader /> */}
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: loadMarkdown(message.content),
                    }}
                  />

                  {/* {message.type === "bot" && (
                    <div className="flex justify-end">
                      <div className="bg-white outline-black p-1 rounded-md cursor-pointer">
                        <Copy size={20} />
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border border-black rounded-lg p-2 h-10"
            />
            <Button onClick={handleSendMessage}>
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`bg-gray-100 transition-all duration-300 ease-in-out ${
          rightSidebarOpen ? "w-64" : "w-0"
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
