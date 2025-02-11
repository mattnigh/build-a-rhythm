
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface OrganizationHeaderProps {
  name: string;
}

const OrganizationHeader = ({ name }: OrganizationHeaderProps) => {
  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border-0 shadow-sm mb-8 p-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rhythm-100 rounded-lg">
          <Building2 className="w-6 h-6 text-rhythm-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-rhythm-600">Organization</p>
          <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
        </div>
      </div>
    </Card>
  );
};

export default OrganizationHeader;
