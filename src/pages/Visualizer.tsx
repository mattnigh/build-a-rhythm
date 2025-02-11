
import { useMemo } from "react";
import defaultRhythm from "@/data/default-rhythm.md?raw";

const getRhythmData = (content: string) => {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { title: '', items: [] as any[] };
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { 
        title: line.replace('## ', ''), 
        items: []
      };
    } else if (line.startsWith('- ')) {
      const match = line.match(/- (.*?)\[(.*?)\]\s*\[(.*?)\](.*)/);
      if (match) {
        currentSection.items.push({
          name: match[1].trim(),
          attendees: match[2].trim(),
          duration: match[3].trim(),
          link: match[4]?.trim()
        });
      }
    }
  }
  if (currentSection.title) {
    sections.push(currentSection);
  }
  return sections;
};

const Visualizer = () => {
  const rhythmData = useMemo(() => getRhythmData(defaultRhythm), []);
  const totalSections = rhythmData.length;
  const radius = 300;
  const center = radius + 100; // Increased center padding
  const size = (center + radius) * 2;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Rhythm Visualizer</h1>
      <div className="w-full overflow-x-auto">
        <svg width={size} height={size} className="mx-auto">
          {rhythmData.map((section, sectionIndex) => {
            const sectionAngle = (2 * Math.PI) / totalSections;
            const startAngle = sectionIndex * sectionAngle;
            const items = section.items.length;
            
            return section.items.map((item, itemIndex) => {
              const itemAngle = sectionAngle / (items + 1);
              const angle = startAngle + (itemIndex + 1) * itemAngle;
              
              // Adjust radius based on index to prevent overlapping
              const itemRadius = radius - (itemIndex * 20);
              
              const x = center + itemRadius * Math.cos(angle - Math.PI / 2);
              const y = center + itemRadius * Math.sin(angle - Math.PI / 2);
              
              const frequency = section.title.toLowerCase();
              const color = frequency.includes('daily') ? 'rgb(147, 197, 253)' :
                           frequency.includes('weekly') ? 'rgb(167, 243, 208)' :
                           frequency.includes('monthly') ? 'rgb(253, 230, 138)' :
                           frequency.includes('quarterly') ? 'rgb(252, 165, 165)' :
                           'rgb(216, 180, 254)';

              return (
                <g key={`${sectionIndex}-${itemIndex}`}>
                  <rect
                    x={x - 70}
                    y={y - 40}
                    width="140"
                    height="80"
                    rx="8"
                    fill={color}
                    fillOpacity="0.7"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="text-xs font-medium"
                    fill="#374151"
                  >
                    {item.name}
                  </text>
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="text-xs"
                    fill="#6B7280"
                  >
                    {item.attendees}
                  </text>
                  <text
                    x={x}
                    y={y + 25}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="text-xs"
                    fill="#6B7280"
                  >
                    {item.duration} • {section.title}
                  </text>
                </g>
              );
            });
          })}
          <circle
            cx={center}
            cy={center}
            r="80"
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-lg font-semibold"
            fill="#374151"
          >
            Rhythm
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Visualizer;

