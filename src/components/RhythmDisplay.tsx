
import { Card } from "@/components/ui/card";
import { Calendar, Users, Target, Clock, ExternalLink, Clock3, Repeat } from "lucide-react";
import { useMemo } from "react";

interface RhythmDisplayProps {
  content: string;
}

interface RhythmItem {
  text: string;
  attendees: string;
  duration: string;
  frequency: string;
  link?: string;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  "Planning": <Target className="w-5 h-5 text-rhythm-600" />,
  "Business Reviews": <Clock className="w-5 h-5 text-rhythm-600" />,
  "Team Meetings": <Users className="w-5 h-5 text-rhythm-600" />,
  "Product Sessions": <Target className="w-5 h-5 text-rhythm-600" />,
  "Strategy & Leadership": <Calendar className="w-5 h-5 text-rhythm-600" />,
  "Technical Sessions": <Target className="w-5 h-5 text-rhythm-600" />,
  "Design & Innovation": <Target className="w-5 h-5 text-rhythm-600" />,
  "Growth & Marketing": <Target className="w-5 h-5 text-rhythm-600" />,
  "Customer Success": <Users className="w-5 h-5 text-rhythm-600" />,
};

const RhythmDisplay = ({ content }: RhythmDisplayProps) => {
  const sections = useMemo(() => {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = { title: '', content: [] as RhythmItem[] };
    
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
      } else if (line.startsWith('- ') && line.trim()) {
        const match = line.match(/- (.*?)\[(.*?)\]\s*\[(.*?)\]\s*\[(.*?)\](.*)/);
        if (match) {
          currentSection.content.push({
            text: match[1].trim(),
            attendees: match[2].trim(),
            duration: match[3].trim(),
            frequency: match[4].trim(),
            link: match[5]?.trim()
          });
        }
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
              {categoryIcons[section.title] || <Calendar className="w-5 h-5 text-rhythm-600" />}
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-2 group">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rhythm-600 transition-opacity mt-1"
                      title="Open meeting link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800">{item.text}</p>
                      <span className="text-sm text-rhythm-600 font-medium">
                        {item.attendees}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        <span>{item.frequency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RhythmDisplay;
