import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/hooks/use-workspace";
import { attachFile, deleteFile } from "@/services/workspace";
import { FileIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { general, code } from "./util";

const RightPanel = () => {
  const { workspace, setCurrentWorkspace } = useWorkspace();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files);
    if (!workspace) {
      toast.info("Please select a workspace");
      return;
    }

    if (!newFiles.length) {
      toast.error("Error uploading files");
      return;
    }

    const formData = new FormData();
    newFiles.forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);

    try {
      const response = await attachFile(newFiles, workspace?.id);

      const result = await response.json();
      console.log(result);
      if (result.status === "success") {
        setCurrentWorkspace({
          ...workspace,
          files: [...(workspace.files || []), ...result.data],
        });
        toast.success("Files uploaded successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  function truncateString(str: string) {
    const num = 16;
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  async function handleDeleteFile(file: any) {
    if (!workspace || !file) {
      toast.error("Error deleting file");
      return;
    }
    setDeleting([...deleting, file.id]);
    try {
      const response = await deleteFile(workspace?.id, file.id);
      if (response.status === "success") {
        setCurrentWorkspace({
          ...workspace,
          files: response.data,
        }),
          toast.success("File deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeleting(deleting.filter((id) => id !== file.id));
    }
  }
  return (
    <div className="p-4 ">
      <Tabs
        defaultValue={
          workspace && workspace?.files?.length > 0 ? "files" : "upload"
        }
        className=""
      >
        <TabsList className="w-full bg-slate-100 border border-black rounded-lg">
          <TabsTrigger value="files" className="flex-1">
            Files
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">
            Upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="files">
          <ScrollArea className="h-[calc(100vh-90px)]">
            <div className="space-y-2">
              {workspace?.files &&
                workspace?.files.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-2 py-1 bg-[#fff] rounded-md"
                  >
                    <div className="flex items-center">
                      <FileIcon className="mr-2 h-4 w-4" />

                      <div className="flex flex-col gap-1">
                        <span className="text-sm truncate">
                          {truncateString(file.name)}
                        </span>
                        <div className="flex gap-2">
                          <span className="text-xs text-gray-500">
                            {file.size}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {file?.createdAt?.split("T")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={deleting.includes(file.id) ? "loading" : "ghost"}
                      className="text-sm"
                      size="icon"
                      onClick={() => {
                        handleDeleteFile(file);
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
            onChange={(e) => handleFileUpload(e.target.files!)}
            multiple
            accept={workspace && workspace?.role === "code" ? code : general}
          />
          <Button
            className="w-full mt-4"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            variant={uploading ? "loading" : "default"}
          >
            Select Files
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
