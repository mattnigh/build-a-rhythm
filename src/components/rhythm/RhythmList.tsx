
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Trash2, X, Check } from "lucide-react";
import { RhythmItem } from "@/types/rhythm";

interface RhythmListProps {
  rhythms: RhythmItem[];
  removeRhythm: (index: number) => void;
  generateMarkdown: () => void;
}

const RhythmList = ({ rhythms, removeRhythm, generateMarkdown }: RhythmListProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingRhythm, setEditingRhythm] = useState<RhythmItem | null>(null);

  if (rhythms.length === 0) return null;

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingRhythm({ ...rhythms[index] });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingRhythm(null);
  };

  const saveEditing = (index: number) => {
    if (editingRhythm) {
      rhythms[index] = editingRhythm;
      setEditingIndex(null);
      setEditingRhythm(null);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Added Rhythms</h2>
        <div className="space-y-3">
          {rhythms.map((rhythm, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              {editingIndex === index && editingRhythm ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editingRhythm.name}
                    onChange={(e) => setEditingRhythm({ ...editingRhythm, name: e.target.value })}
                    placeholder="Name"
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={editingRhythm.category}
                      onChange={(e) => setEditingRhythm({ ...editingRhythm, category: e.target.value })}
                      placeholder="Category"
                    />
                    <Input
                      value={editingRhythm.attendees}
                      onChange={(e) => setEditingRhythm({ ...editingRhythm, attendees: e.target.value })}
                      placeholder="Attendees"
                    />
                    <Input
                      value={editingRhythm.duration}
                      onChange={(e) => setEditingRhythm({ ...editingRhythm, duration: e.target.value })}
                      placeholder="Duration"
                    />
                    <Input
                      value={editingRhythm.frequency}
                      onChange={(e) => setEditingRhythm({ ...editingRhythm, frequency: e.target.value })}
                      placeholder="Frequency"
                    />
                    <Input
                      value={editingRhythm.link}
                      onChange={(e) => setEditingRhythm({ ...editingRhythm, link: e.target.value })}
                      placeholder="Link (optional)"
                      className="col-span-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      className="text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveEditing(index)}
                      className="text-green-500"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1" onClick={() => startEditing(index)} style={{ cursor: 'pointer' }}>
                    <p className="font-medium text-gray-900">{rhythm.name}</p>
                    <p className="text-sm text-gray-600">
                      {rhythm.category} • {rhythm.attendees} • {rhythm.duration} • {rhythm.frequency}
                    </p>
                    {rhythm.link && (
                      <a
                        href={rhythm.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-rhythm-600 hover:text-rhythm-700 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View meeting link
                      </a>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRhythm(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
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
