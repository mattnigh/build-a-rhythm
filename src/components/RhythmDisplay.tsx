
import { Card } from "@/components/ui/card";
import { Calendar, Users, Target, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useMemo } from "react";

interface RhythmDisplayProps {
  content: string;
}

const RhythmDisplay = ({ content }: RhythmDisplayProps) => {
  const sections = useMemo(() => {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = { title: '', content: [] };
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection.title) {
          sections.push({ ...currentSection });
        }
        currentSection = { 
          title: line.replace('## ', ''), 
          content: []
        };
      } else if (line.startsWith('# ')) {
        // Skip main title
        continue;
      } else if (line.trim()) {
        currentSection.content.push(line);
      }
    }
    if (currentSection.title) {
      sections.push(currentSection);
    }
    return sections;
  }, [content]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {sections.map((section, index) => (
        <Card 
          key={index} 
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {index % 4 === 0 && <Calendar className="w-5 h-5 text-rhythm-600" />}
              {index % 4 === 1 && <Users className="w-5 h-5 text-rhythm-600" />}
              {index % 4 === 2 && <Target className="w-5 h-5 text-rhythm-600" />}
              {index % 4 === 3 && <Clock className="w-5 h-5 text-rhythm-600" />}
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="prose prose-rhythm prose-sm">
              <ReactMarkdown>
                {section.content.join('\n')}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RhythmDisplay;
