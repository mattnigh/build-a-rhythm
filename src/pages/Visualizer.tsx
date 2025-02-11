
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
  const baseRadius = selectedOrgId === "all" ? 200 : 300; // Smaller radius when showing all
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
        <svg width={size} height={size} className="mx-auto">
          {orgsToDisplay.map((org, orgIndex) => {
            const rhythmData = getRhythmData(org.content);
            const totalSections = rhythmData.length;
            const angleOffset = selectedOrgId === "all" ? (2 * Math.PI * orgIndex) / totalOrgs : 0;

            return (
              <g key={org.id}>
                {selectedOrgId === "all" && (
                  <text
                    x={center}
                    y={40 + (orgIndex * 20)}
                    textAnchor="middle"
                    className="text-sm font-medium"
                    fill="#374151"
                  >
                    {getHeaderInfo(org.content)}
                  </text>
                )}
                {rhythmData.map((section, sectionIndex) => {
                  const sectionAngle = (2 * Math.PI) / totalSections;
                  const startAngle = sectionIndex * sectionAngle + angleOffset;
                  const items = section.items.length;
                  
                  return section.items.map((item, itemIndex) => {
                    const itemAngle = sectionAngle / (items + 1);
                    const angle = startAngle + (itemIndex + 1) * itemAngle;
                    
                    const itemRadius = baseRadius - (itemIndex * 15); // Reduced spacing between items
                    
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
                          x={x - 50}
                          y={y - 30}
                          width="100"
                          height="60"
                          rx="8"
                          fill={color}
                          fillOpacity="0.7"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          className="text-[10px] font-medium"
                          fill="#374151"
                        >
                          {item.name}
                        </text>
                        <text
                          x={x}
                          y={y + 3}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          className="text-[8px]"
                          fill="#6B7280"
                        >
                          {item.attendees}
                        </text>
                        <text
                          x={x}
                          y={y + 18}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          className="text-[8px]"
                          fill="#6B7280"
                        >
                          {item.duration}
                        </text>
                      </g>
                    );
                  });
                })}
                <circle
                  cx={center}
                  cy={center}
                  r="60"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                {selectedOrgId !== "all" && (
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
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Visualizer;

