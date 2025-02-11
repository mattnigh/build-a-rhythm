
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
                <Select
                  value={currentRhythm.category}
                  onValueChange={(value) => setCurrentRhythm({ ...currentRhythm, category: value })}
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees
                </label>
                <Input
                  placeholder="Enter attendees"
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
                <Select
                  value={currentRhythm.frequency}
                  onValueChange={(value) => setCurrentRhythm({ ...currentRhythm, frequency: value })}
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
                  </SelectContent>
                </Select>
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

