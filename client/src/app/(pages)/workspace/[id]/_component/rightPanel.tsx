import React, { useRef, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, UploadIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RightPanelProps {
  files: any;
}
const RightPanel = ({ files }: RightPanelProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<any>(files || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleDragOver = (e: any) => {
  //   e.preventDefault();
  //   setIsDragging(true);
  // };

  // const handleDragLeave = () => {
  //   setIsDragging(false);
  // };

  // const handleDrop = (e: any) => {
  //   e.preventDefault();
  //   setIsDragging(false);
  //   const files = e.dataTransfer.files;
  //   handleFileUpload(files);
  // };

  const handleFileUpload = (files: any) => {
    const newFiles = Array.from(files).map((file: any) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  return (
    <div className="p-4 ">
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
              {uploadedFiles.map((file: any, index: number) => (
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
                        uploadedFiles.filter((_: any, i: number) => i !== index)
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
            // onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            // onDrop={handleDrop}
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
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled
          >
            Select Files
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
