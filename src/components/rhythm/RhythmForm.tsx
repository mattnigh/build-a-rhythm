
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CATEGORIES } from "@/utils/rhythmUtils";
import { FREQUENCIES, RhythmItem } from "@/types/rhythm";

interface RhythmFormProps {
  currentRhythm: RhythmItem;
  setCurrentRhythm: (rhythm: RhythmItem) => void;
  showCustomCategory: boolean;
  setShowCustomCategory: (show: boolean) => void;
  showCustomFrequency: boolean;
  setShowCustomFrequency: (show: boolean) => void;
  addRhythm: () => void;
}

const RhythmForm = ({
  currentRhythm,
  setCurrentRhythm,
  showCustomCategory,
  setShowCustomCategory,
  showCustomFrequency,
  setShowCustomFrequency,
  addRhythm
}: RhythmFormProps) => {
  return (
    <Card className="p-6 space-y-6 bg-card border shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Add New Rhythm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Meeting Name
            </label>
            <Input
              placeholder="Enter meeting name"
              value={currentRhythm.name}
              onChange={(e) => setCurrentRhythm({ ...currentRhythm, name: e.target.value })}
              className="bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
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
                  <SelectTrigger className="bg-background">
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
                  className="bg-background"
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
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Attendee Group
            </label>
            <Input
              placeholder="Enter attendee group"
              value={currentRhythm.attendees}
              onChange={(e) => setCurrentRhythm({ ...currentRhythm, attendees: e.target.value })}
              className="bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Duration (e.g., 60 min)
            </label>
            <Input
              placeholder="Enter duration"
              value={currentRhythm.duration}
              onChange={(e) => setCurrentRhythm({ ...currentRhythm, duration: e.target.value })}
              className="bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
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
                  <SelectTrigger className="bg-background">
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
                  className="bg-background"
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
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Meeting Link (optional)
            </label>
            <Input
              placeholder="Enter meeting link"
              value={currentRhythm.link}
              onChange={(e) => setCurrentRhythm({ ...currentRhythm, link: e.target.value })}
              className="bg-background"
            />
          </div>
        </div>

        <Button onClick={addRhythm} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Rhythm
        </Button>
      </div>
    </Card>
  );
};

export default RhythmForm;
