
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RhythmItem } from "@/types/rhythm";
import { generateMarkdown } from "@/utils/rhythmUtils";
import TemplateSelector from "@/components/rhythm/TemplateSelector";
import OrganizationDetails from "@/components/rhythm/OrganizationDetails";
import RhythmForm from "@/components/rhythm/RhythmForm";
import RhythmList from "@/components/rhythm/RhythmList";

const RhythmBuilder = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [rhythms, setRhythms] = useState<RhythmItem[]>([]);
  const [currentRhythm, setCurrentRhythm] = useState<RhythmItem>({
    name: "",
    category: "",
    attendees: "",
    duration: "",
    frequency: "",
    link: ""
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomFrequency, setShowCustomFrequency] = useState(false);

  const addRhythm = () => {
    if (!currentRhythm.name || !currentRhythm.category || !currentRhythm.attendees || !currentRhythm.duration || !currentRhythm.frequency) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields before adding a rhythm.",
        variant: "destructive"
      });
      return;
    }
    
    setRhythms([...rhythms, currentRhythm]);
    setCurrentRhythm({
      name: "",
      category: "",
      attendees: "",
      duration: "",
      frequency: "",
      link: ""
    });
    setShowCustomCategory(false);
    setShowCustomFrequency(false);
    
    toast({
      title: "Rhythm Added",
      description: "Your rhythm has been added successfully."
    });
  };

  const removeRhythm = (index: number) => {
    const newRhythms = rhythms.filter((_, i) => i !== index);
    setRhythms(newRhythms);
    toast({
      title: "Rhythm Removed",
      description: "The rhythm has been removed successfully."
    });
  };

  const handleGenerateMarkdown = () => {
    if (!organizationName) {
      toast({
        title: "Missing Organization Name",
        description: "Please provide an organization name before exporting.",
        variant: "destructive"
      });
      return;
    }

    if (rhythms.length === 0) {
      toast({
        title: "No Rhythms Added",
        description: "Please add at least one rhythm before exporting.",
        variant: "destructive"
      });
      return;
    }

    const markdown = generateMarkdown(organizationName, rhythms);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${organizationName.toLowerCase().replace(/\s+/g, '-')}-rhythm.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Your rhythm markdown file has been downloaded."
    });
  };

  const loadTemplate = async (templateSize: string) => {
    try {
      const response = await fetch(`/src/data/templates/${templateSize}.md`);
      const templateContent = await response.text();
      
      const lines = templateContent.split('\n');
      const rhythmsToAdd: RhythmItem[] = [];
      let currentCategory = "";
      
      lines.forEach(line => {
        if (line.startsWith('## ')) {
          currentCategory = line.replace('## ', '').trim();
        } else if (line.startsWith('- ')) {
          const match = line.match(/- (.*?)\[(.*?)\]\s*\[(.*?)\]\s*\[(.*?)\](.*)/);
          if (match) {
            rhythmsToAdd.push({
              name: match[1].trim(),
              category: currentCategory,
              attendees: match[2].trim(),
              duration: match[3].trim(),
              frequency: match[4].trim(),
              link: match[5]?.trim() || ""
            });
          }
        }
      });
      
      setRhythms(rhythmsToAdd);
      toast({
        title: "Template Loaded",
        description: "The template has been successfully loaded."
      });
    } catch (error) {
      toast({
        title: "Error Loading Template",
        description: "Failed to load the template. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhythm-50 via-white to-rhythm-50 p-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Rhythm Builder</h1>
          <p className="text-gray-600">Create and export your organization's rhythm of business</p>
        </div>

        <TemplateSelector loadTemplate={loadTemplate} />

        <OrganizationDetails
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
        />

        <RhythmForm
          currentRhythm={currentRhythm}
          setCurrentRhythm={setCurrentRhythm}
          showCustomCategory={showCustomCategory}
          setShowCustomCategory={setShowCustomCategory}
          showCustomFrequency={showCustomFrequency}
          setShowCustomFrequency={setShowCustomFrequency}
          addRhythm={addRhythm}
        />

        <RhythmList
          rhythms={rhythms}
          removeRhythm={removeRhythm}
          generateMarkdown={handleGenerateMarkdown}
        />
      </div>
    </div>
  );
};

export default RhythmBuilder;
