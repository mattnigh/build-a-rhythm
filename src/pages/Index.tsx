
import { useState, useEffect } from "react";
import OrganizationHeader from "@/components/OrganizationHeader";
import RhythmDisplay from "@/components/RhythmDisplay";
import defaultRhythm from "@/data/default-rhythm.md?raw";

const Index = () => {
  const [rhythmContent, setRhythmContent] = useState<string>(defaultRhythm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhythm-50 to-white">
      <div className="container py-8 space-y-6 animate-fade-in-slow">
        <OrganizationHeader name="Rhythm Minder" />
        <RhythmDisplay content={rhythmContent} />
      </div>
    </div>
  );
};

export default Index;
