
import { Card } from "@/components/ui/card";
import { Building2, GitBranch, MessageSquare, Link2 } from "lucide-react";
import { OrgDetail } from "@/types/rhythm";

interface OrganizationHeaderProps {
  name: string;
  details?: OrgDetail[];
}

const OrganizationHeader = ({ name, details = [] }: OrganizationHeaderProps) => {
  const getIcon = (type: string) => {
    if (type.toLowerCase().includes('repo')) return <GitBranch className="w-4 h-4 text-primary" />;
    if (type.toLowerCase().includes('slack')) return <MessageSquare className="w-4 h-4 text-primary" />;
    return <Link2 className="w-4 h-4 text-primary" />;
  };

  return (
    <Card className="w-full bg-card border shadow-sm p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Organization/Team</p>
            <h1 className="text-2xl font-semibold text-foreground">{name}</h1>
          </div>
        </div>

        {details.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Org Details</h2>
            <div className="space-y-2">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1.5 bg-secondary rounded">
                    {getIcon(detail.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{detail.type}</p>
                    <a
                      href={detail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/90 hover:underline"
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
