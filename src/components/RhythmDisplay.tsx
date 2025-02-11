
import { Card } from "@/components/ui/card";
import { Calendar, Users, Target, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface RhythmDisplayProps {
  content: string;
}

const RhythmDisplay = ({ content }: RhythmDisplayProps) => {
  return (
    <Card className="w-full p-6 bg-white/50 backdrop-blur-sm border-0 shadow-sm animate-fade-in">
      <div className="prose prose-rhythm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </Card>
  );
};

export default RhythmDisplay;
