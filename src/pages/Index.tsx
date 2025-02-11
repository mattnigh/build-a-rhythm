
import { useState } from "react";
import OrganizationHeader from "@/components/OrganizationHeader";
import FileUpload from "@/components/FileUpload";
import RhythmDisplay from "@/components/RhythmDisplay";

const Index = () => {
  const [rhythmContent, setRhythmContent] = useState<string>("");

  const handleFileUpload = (content: string) => {
    setRhythmContent(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhythm-50 to-white">
      <div className="container py-8 space-y-6 animate-fade-in-slow">
        <OrganizationHeader name="Rhythm Minder" />
        
        {!rhythmContent && <FileUpload onFileUpload={handleFileUpload} />}
        
        {rhythmContent && <RhythmDisplay content={rhythmContent} />}
      </div>
    </div>
  );
};

export default Index;
