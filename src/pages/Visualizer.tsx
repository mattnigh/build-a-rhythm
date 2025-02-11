
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
  const rhythmColors = {
    daily: 'bg-blue-100 border-blue-300',
    weekly: 'bg-green-100 border-green-300',
    monthly: 'bg-yellow-100 border-yellow-300',
    quarterly: 'bg-red-100 border-red-300',
    annual: 'bg-purple-100 border-purple-300',
    'bi-weekly': 'bg-indigo-100 border-indigo-300'
  };

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

      <div className="grid grid-cols-1 gap-8">
        {orgsToDisplay.map((org) => {
          const rhythmData = getRhythmData(org.content);
          return (
            <div key={org.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">{getHeaderInfo(org.content)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rhythmData.map((section, sectionIndex) => {
                  const frequency = section.title.toLowerCase();
                  const colorClass = Object.entries(rhythmColors).find(([key]) => 
                    frequency.includes(key)
                  )?.[1] || 'bg-gray-100 border-gray-300';

                  return (
                    <div 
                      key={sectionIndex}
                      className="relative"
                    >
                      <div className="mb-3 text-sm font-medium text-gray-900">
                        {section.title}
                      </div>
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`p-3 rounded-lg border ${colorClass} transition-all hover:shadow-md`}
                          >
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.attendees} • {item.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Visualizer;
