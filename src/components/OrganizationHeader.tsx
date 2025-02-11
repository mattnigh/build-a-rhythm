
import { Card } from "@/components/ui/card";
import { Building2, GitBranch, MessageSquare, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface OrganizationHeaderProps {
  name: string;
}

// Interface for organization details
interface OrgDetail {
  id: string;
  label: string;
  url: string;
}

const OrganizationHeader = ({ name }: OrganizationHeaderProps) => {
  // State to manage organization details
  const [orgDetails, setOrgDetails] = useState<OrgDetail[]>([
    { id: "1", label: "Team Repos", url: "" },
    { id: "2", label: "Slack Channels", url: "" },
  ]);

  // Handler for updating detail URLs
  const handleDetailChange = (id: string, newUrl: string) => {
    setOrgDetails(prevDetails =>
      prevDetails.map(detail =>
        detail.id === id ? { ...detail, url: newUrl } : detail
      )
    );
  };

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border-0 shadow-sm mb-8 p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Organization Name Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rhythm-100 rounded-lg">
            <Building2 className="w-6 h-6 text-rhythm-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-rhythm-600">Organization/Team</p>
            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
          </div>
        </div>

        {/* Org Details Section */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Org Details</h2>
          <div className="space-y-3">
            {orgDetails.map((detail) => (
              <div key={detail.id} className="flex items-center gap-3">
                <div className="p-1.5 bg-rhythm-50 rounded">
                  {detail.label === "Team Repos" ? (
                    <GitBranch className="w-4 h-4 text-rhythm-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-rhythm-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{detail.label}</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Add ${detail.label.toLowerCase()} URL`}
                      value={detail.url}
                      onChange={(e) => handleDetailChange(detail.id, e.target.value)}
                      className="text-sm"
                    />
                    {detail.url && (
                      <a
                        href={detail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-rhythm-50 rounded hover:bg-rhythm-100 transition-colors"
                        title="Open link"
                      >
                        <LinkIcon className="w-4 h-4 text-rhythm-600" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrganizationHeader;

