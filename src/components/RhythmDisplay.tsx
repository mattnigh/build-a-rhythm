
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
  "Planning": <Target className="w-5 h-5 text-primary" />,
  "Business Reviews": <Clock className="w-5 h-5 text-primary" />,
  "Team Meetings": <Users className="w-5 h-5 text-primary" />,
  "Product Sessions": <Target className="w-5 h-5 text-primary" />,
  "Strategy & Leadership": <Calendar className="w-5 h-5 text-primary" />,
  "Technical Sessions": <Target className="w-5 h-5 text-primary" />,
  "Design & Innovation": <Target className="w-5 h-5 text-primary" />,
  "Growth & Marketing": <Target className="w-5 h-5 text-primary" />,
  "Customer Success": <Users className="w-5 h-5 text-primary" />,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section, index) => (
        <Card 
          key={index} 
          className="bg-card border shadow-sm p-6 animate-fade-in"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                {categoryIcons[section.title] || <Calendar className="w-5 h-5 text-primary" />}
              </div>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">{item.text}</p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/90 transition-colors"
                            title="Open meeting link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <span className="text-sm text-primary font-medium">
                        {item.attendees}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
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
