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
// import { useToast } from "@/components/ui/use-toast";
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
} from "lucide-react";
import { CreateWorkspaceForm } from "@/components/workspaces/workspace-form";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspace,
} from "@/services/workspace";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";

export default function ChatWorkspace() {
  const {
    workspace: currentWorkspace,
    workspaces,
    setWorkspaces,
    setCurrentWorkspace,
  } = useWorkspace();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  // const [workspaces, setWorkspaces] = useState([]);
  // const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [showCreateWorkspaceForm, setShowCreateWorkspaceForm] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const id = useParams().id;
  const router = useRouter();

  console.log(id);

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

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    // toast({
    //   title: "Files uploaded",
    //   description: `${newFiles.length} file(s) have been uploaded successfully.`,
    // });
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
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
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Workspaces</h2>
            <Button
              className="w-full mb-4"
              onClick={() => {
                setShowCreateWorkspaceForm(true);
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New Workspace
            </Button>
            <ScrollArea className="h-[calc(100vh-120px)]">
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
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {message.content}
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
        {rightSidebarOpen && (
          <div className="p-4">
            <Tabs defaultValue="upload" className="">
              <TabsList className="w-full bg-slate-200 border border-black rounded-lg">
                <TabsTrigger value="files" className="flex-1">
                  Files
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex-1">
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="files">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded-md"
                      >
                        <div className="flex items-center">
                          <FileIcon className="mr-2 h-4 w-4" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setUploadedFiles(
                              uploadedFiles.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="upload">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    isDragging ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop files here or click to upload
                  </p>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  multiple
                />
                <Button
                  className="w-full mt-4"
                  onClick={() => fileInputRef.current.click()}
                >
                  Select Files
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      <CreateWorkspaceForm
        isOpen={showCreateWorkspaceForm}
        onClose={() => setShowCreateWorkspaceForm(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  );
}
