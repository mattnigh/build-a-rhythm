
import { useState } from "react";
import OrganizationHeader from "@/components/OrganizationHeader";
import RhythmDisplay from "@/components/RhythmDisplay";
import { organizations } from "@/data/organizations";
import { parseOrgDetails } from "@/utils/rhythmUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeamRhythms = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0].id);
  const selectedOrg = organizations.find(org => org.id === selectedOrgId) || organizations[0];

  // Extract header info from markdown
  const getHeaderInfo = (content: string) => {
    const lines = content.split('\n');
    const headerLine = lines.find(line => line.startsWith('# '));
    return headerLine ? headerLine.replace('# ', '') : "Rhythm Minder";
  };

  // Parse organization details
  const orgDetails = parseOrgDetails(selectedOrg.content);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 animate-fade-in-slow">
        <OrganizationHeader 
          name={getHeaderInfo(selectedOrg.content)} 
          details={orgDetails}
        />
        
        <div className="flex items-center gap-3 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Select Org/Team</span>
          <Select
            value={selectedOrgId}
            onValueChange={(value) => setSelectedOrgId(value)}
          >
            <SelectTrigger className="w-[280px] bg-card">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {getHeaderInfo(org.content)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <RhythmDisplay content={selectedOrg.content} />
      </div>
    </div>
  );
};

export default TeamRhythms;
