
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TEAM_SIZE_TEMPLATES } from "@/types/rhythm";
import { Download } from "lucide-react";

interface TemplateSelectorProps {
  loadTemplate: (templateSize: string) => void;
}

const TemplateSelector = ({ loadTemplate }: TemplateSelectorProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Load Template</h2>
        <p className="text-sm text-gray-600">Select a template based on your team size:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TEAM_SIZE_TEMPLATES.map((template) => (
            <Button
              key={template.value}
              variant="outline"
              onClick={() => loadTemplate(template.value)}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {template.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TemplateSelector;
