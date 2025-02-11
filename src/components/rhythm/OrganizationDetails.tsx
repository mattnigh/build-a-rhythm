
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { OrgDetail } from "@/types/rhythm";
import { toast } from "@/hooks/use-toast";

interface OrganizationDetailsProps {
  organizationName: string;
  setOrganizationName: (name: string) => void;
  orgDetails: OrgDetail[];
  setOrgDetails: (details: OrgDetail[]) => void;
}

const OrganizationDetails = ({ 
  organizationName, 
  setOrganizationName,
  orgDetails,
  setOrgDetails
}: OrganizationDetailsProps) => {
  const [newDetailType, setNewDetailType] = useState("");
  const [newDetailUrl, setNewDetailUrl] = useState("");

  const addDetail = () => {
    if (!newDetailType || !newDetailUrl) {
      toast({
        title: "Missing Fields",
        description: "Please fill in both the type and URL fields.",
        variant: "destructive"
      });
      return;
    }

    setOrgDetails([...orgDetails, { type: newDetailType, url: newDetailUrl }]);
    setNewDetailType("");
    setNewDetailUrl("");
    
    toast({
      title: "Detail Added",
      description: "Organization detail has been added successfully."
    });
  };

  const removeDetail = (index: number) => {
    const newDetails = orgDetails.filter((_, i) => i !== index);
    setOrgDetails(newDetails);
    
    toast({
      title: "Detail Removed",
      description: "Organization detail has been removed successfully."
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detail Type
              </label>
              <Input
                placeholder="e.g., Team Repos, Slack Channels"
                value={newDetailType}
                onChange={(e) => setNewDetailType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <Input
                placeholder="Enter URL"
                value={newDetailUrl}
                onChange={(e) => setNewDetailUrl(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={addDetail} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Detail
          </Button>
        </div>

        {orgDetails.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Added Details</h3>
            {orgDetails.map((detail, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">{detail.type}</p>
                  <a 
                    href={detail.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-rhythm-600 hover:text-rhythm-700 hover:underline"
                  >
                    {detail.url}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDetail(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrganizationDetails;
