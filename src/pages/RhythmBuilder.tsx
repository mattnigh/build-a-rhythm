
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RhythmItem, OrgDetail } from "@/types/rhythm";
import { generateMarkdown } from "@/utils/rhythmUtils";
import { getRhythmData, getHeaderInfo, parseOrgDetails } from "@/utils/rhythmParser";
import OrganizationDetails from "@/components/rhythm/OrganizationDetails";
import RhythmForm from "@/components/rhythm/RhythmForm";
import RhythmList from "@/components/rhythm/RhythmList";
import FileUpload from "@/components/FileUpload";

const RhythmBuilder = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [orgDetails, setOrgDetails] = useState<OrgDetail[]>([]);
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

  const handleFileUpload = (content: string) => {
    try {
      const header = getHeaderInfo(content);
      setOrganizationName(header.replace(" - Rhythm of Business", ""));
      
      const details = parseOrgDetails(content);
      setOrgDetails(details);
      
      const sections = getRhythmData(content);
      const allRhythms: RhythmItem[] = sections.flatMap(section => 
        section.items.map(item => ({
          name: item.name,
          category: section.title,
          attendees: item.attendees,
          duration: item.duration.toString(),
          frequency: item.frequency,
          link: item.link || ""
        }))
      );
      
      setRhythms(allRhythms);
      
      toast({
        title: "File Imported",
        description: "Your rhythm file has been successfully imported."
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to parse the markdown file. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const addRhythm = () => {
    if (!currentRhythm.name) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for the rhythm.",
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
        description: "Please provide an organization or team name before exporting.",
        variant: "destructive"
      });
      return;
    }

    const markdown = generateMarkdown(organizationName, rhythms, orgDetails);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Rhythm Builder</h1>
          <p className="text-muted-foreground">Create and export your organization's rhythm of business</p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} />

        <OrganizationDetails
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          orgDetails={orgDetails}
          setOrgDetails={setOrgDetails}
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
