
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { RhythmItem } from "@/types/rhythm";

interface RhythmListProps {
  rhythms: RhythmItem[];
  removeRhythm: (index: number) => void;
  generateMarkdown: () => void;
}

const RhythmList = ({ rhythms, removeRhythm, generateMarkdown }: RhythmListProps) => {
  if (rhythms.length === 0) return null;

  return (
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
  );
};

export default RhythmList;
