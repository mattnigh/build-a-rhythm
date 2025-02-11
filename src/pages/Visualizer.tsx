
import { useMemo, useState } from "react";
import { organizations } from "@/data/organizations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedOrgId, setSelectedOrgId] = useState<string>("all");
  
  const getOrganizationsToDisplay = () => {
    if (selectedOrgId === "all") {
      return organizations;
    }
    const org = organizations.find(org => org.id === selectedOrgId);
    return org ? [org] : [];
  };

  const getHeaderInfo = (content: string) => {
    const lines = content.split('\n');
    const headerLine = lines.find(line => line.startsWith('# '));
    return headerLine ? headerLine.replace('# ', '') : "Rhythm Visualizer";
  };

  const orgsToDisplay = getOrganizationsToDisplay();
  const totalOrgs = orgsToDisplay.length;
  const baseRadius = 300;
  const spacing = 50;
  const center = baseRadius + 100;
  const size = (center + baseRadius) * 2;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Rhythm Visualizer</h1>
        <Select
          value={selectedOrgId}
          onValueChange={(value) => setSelectedOrgId(value)}
        >
          <SelectTrigger className="w-[280px] bg-white">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {getHeaderInfo(org.content)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full overflow-x-auto">
        {orgsToDisplay.map((org, orgIndex) => {
          const rhythmData = getRhythmData(org.content);
          const totalSections = rhythmData.length;
          const yOffset = orgIndex * (baseRadius * 2 + spacing);

          return (
            <div key={org.id} className="relative">
              <h2 className="text-xl font-semibold mb-4 text-center">{getHeaderInfo(org.content)}</h2>
              <svg width={size} height={size} className="mx-auto">
                {rhythmData.map((section, sectionIndex) => {
                  const sectionAngle = (2 * Math.PI) / totalSections;
                  const startAngle = sectionIndex * sectionAngle;
                  const items = section.items.length;
                  
                  return section.items.map((item, itemIndex) => {
                    const itemAngle = sectionAngle / (items + 1);
                    const angle = startAngle + (itemIndex + 1) * itemAngle;
                    
                    const itemRadius = baseRadius - (itemIndex * 20);
                    
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
          );
        })}
      </div>
    </div>
  );
};

export default Visualizer;
