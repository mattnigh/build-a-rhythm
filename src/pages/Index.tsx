
import { useState } from "react";
import OrganizationHeader from "@/components/OrganizationHeader";
import RhythmDisplay from "@/components/RhythmDisplay";
import defaultRhythm from "@/data/default-rhythm.md?raw";

const Index = () => {
  const [rhythmContent] = useState<string>(defaultRhythm);

  // Extract header info from markdown
  const getHeaderInfo = (content: string) => {
    const lines = content.split('\n');
    const headerLine = lines.find(line => line.startsWith('# '));
    return headerLine ? headerLine.replace('# ', '') : "Rhythm Minder";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhythm-50 via-white to-rhythm-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in-slow">
        <OrganizationHeader name={getHeaderInfo(rhythmContent)} />
        <RhythmDisplay content={rhythmContent} />
      </div>
    </div>
  );
};

export default Index;
