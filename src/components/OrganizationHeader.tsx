
import { Card } from "@/components/ui/card";
import { Building2, GitBranch, MessageSquare, Link2, User2 } from "lucide-react";
import { OrgDetail } from "@/types/rhythm";

interface OrganizationHeaderProps {
  name: string;
  details?: OrgDetail[];
}

const OrganizationHeader = ({ name, details = [] }: OrganizationHeaderProps) => {
  const getIcon = (type: string) => {
    if (type.toLowerCase().includes('people manager')) return <User2 className="w-4 h-4 text-rhythm-600" />;
    if (type.toLowerCase().includes('repo')) return <GitBranch className="w-4 h-4 text-rhythm-600" />;
    if (type.toLowerCase().includes('slack')) return <MessageSquare className="w-4 h-4 text-rhythm-600" />;
    return <Link2 className="w-4 h-4 text-rhythm-600" />;
  };

  // Sort details to put People Manager first
  const sortedDetails = [...details].sort((a, b) => {
    if (a.type.toLowerCase().includes('people manager')) return -1;
    if (b.type.toLowerCase().includes('people manager')) return 1;
    return 0;
  });

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border-0 shadow-sm mb-8 p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rhythm-100 rounded-lg">
            <Building2 className="w-6 h-6 text-rhythm-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-rhythm-600">Organization/Team</p>
            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
          </div>
        </div>

        {sortedDetails.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Org Details</h2>
            <div className="space-y-2">
              {sortedDetails.map((detail, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1.5 bg-rhythm-50 rounded">
                    {getIcon(detail.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{detail.type}</p>
                    <a
                      href={detail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rhythm-600 hover:text-rhythm-700 hover:underline"
                    >
                      {detail.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrganizationHeader;
