import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Plus, Download, Trash2 } from "lucide-react";
import { organizations } from "@/data/organizations";

interface RhythmItem {
  name: string;
  category: string;
  attendees: string;
  duration: string;
  frequency: string;
  link: string;
}

const CATEGORIES = Array.from(
  new Set(
    organizations.flatMap(org => {
      const lines = org.content.split('\n');
      return lines
        .filter(line => line.startsWith('## '))
        .map(line => line.replace('## ', '').trim());
    })
  )
).sort();

const FREQUENCIES = [
  "daily",
  "weekly",
  "bi-weekly",
  "monthly",
  "quarterly",
  "annual",
  "ad hoc"
];

const TEAM_SIZE_TEMPLATES = [
  { label: "Team of 4-15", value: "team-4-15" },
  { label: "Team of 15-30", value: "team-15-30" },
  { label: "Team of 30-50", value: "team-30-50" },
  { label: "Team of 50-150", value: "team-50-150" },
  { label: "Team of 150-400", value: "team-150-400" },
  { label: "Team of 500+", value: "team-500-plus" }
];

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

  const generateMarkdown = () => {
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

    const rhythmsByCategory: { [key: string]: RhythmItem[] } = {};
    rhythms.forEach(rhythm => {
      if (!rhythmsByCategory[rhythm.category]) {
        rhythmsByCategory[rhythm.category] = [];
      }
      rhythmsByCategory[rhythm.category].push(rhythm);
    });

    let markdown = `# ${organizationName} - Rhythm of Business\n\n`;

    Object.entries(rhythmsByCategory).forEach(([category, items]) => {
      markdown += `## ${category}\n`;
      items.forEach(rhythm => {
        markdown += `- ${rhythm.name} [${rhythm.attendees}] [${rhythm.duration}] [${rhythm.frequency}]${rhythm.link ? ` ${rhythm.link}` : ''}\n`;
      });
      markdown += '\n';
    });

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

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Organization Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <Input
                  placeholder="Enter organization name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Load Template by Team Size
                </label>
                <Select
                  onValueChange={(value) => loadTemplate(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZE_TEMPLATES.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Rhythm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Name
                </label>
                <Input
                  placeholder="Enter meeting name"
                  value={currentRhythm.name}
                  onChange={(e) => setCurrentRhythm({ ...currentRhythm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {!showCustomCategory ? (
                  <div className="space-y-2">
                    <Select
                      value={currentRhythm.category}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setShowCustomCategory(true);
                          setCurrentRhythm({ ...currentRhythm, category: "" });
                        } else {
                          setCurrentRhythm({ ...currentRhythm, category: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Add Custom Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter custom category"
                      value={currentRhythm.category}
                      onChange={(e) => setCurrentRhythm({ ...currentRhythm, category: e.target.value })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCurrentRhythm({ ...currentRhythm, category: "" });
                      }}
                    >
                      Use Predefined Category
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendee Group
                </label>
                <Input
                  placeholder="Enter attendee group"
                  value={currentRhythm.attendees}
                  onChange={(e) => setCurrentRhythm({ ...currentRhythm, attendees: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (e.g., 60 min)
                </label>
                <Input
                  placeholder="Enter duration"
                  value={currentRhythm.duration}
                  onChange={(e) => setCurrentRhythm({ ...currentRhythm, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                {!showCustomFrequency ? (
                  <div className="space-y-2">
                    <Select
                      value={currentRhythm.frequency}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setShowCustomFrequency(true);
                          setCurrentRhythm({ ...currentRhythm, frequency: "" });
                        } else {
                          setCurrentRhythm({ ...currentRhythm, frequency: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCIES.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Add Custom Frequency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter custom frequency"
                      value={currentRhythm.frequency}
                      onChange={(e) => setCurrentRhythm({ ...currentRhythm, frequency: e.target.value })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCustomFrequency(false);
                        setCurrentRhythm({ ...currentRhythm, frequency: "" });
                      }}
                    >
                      Use Predefined Frequency
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (optional)
                </label>
                <Input
                  placeholder="Enter meeting link"
                  value={currentRhythm.link}
                  onChange={(e) => setCurrentRhythm({ ...currentRhythm, link: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={addRhythm} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Rhythm
            </Button>
          </div>
        </Card>

        {rhythms.length > 0 && (
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Added Rhythms</h2>
              <div className="space-y-3">
                {rhythms.map((rhythm, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{rhythm.name}</p>
                      <p className="text-sm text-gray-600">
                        {rhythm.category} • {rhythm.attendees} • {rhythm.duration} • {rhythm.frequency}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRhythm(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={generateMarkdown} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Markdown
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RhythmBuilder;
