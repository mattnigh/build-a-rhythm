
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await processFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "text/markdown") {
      toast({
        title: "Invalid file type",
        description: "Please upload a markdown (.md) file",
        variant: "destructive",
      });
      return;
    }

    try {
      const content = await file.text();
      onFileUpload(content);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file content",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className={`w-full p-8 border-2 border-dashed transition-colors duration-300 ${
        isDragging
          ? "border-rhythm-400 bg-rhythm-50"
          : "border-gray-200 hover:border-rhythm-300"
      } cursor-pointer animate-fade-in`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-3 bg-rhythm-100 rounded-full">
          <Upload className="w-6 h-6 text-rhythm-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Upload Rhythm File</h3>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop your markdown file here, or click to browse
          </p>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md"
        className="hidden"
      />
    </Card>
  );
};

export default FileUpload;

