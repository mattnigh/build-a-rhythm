
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface OrganizationDetailsProps {
  organizationName: string;
  setOrganizationName: (name: string) => void;
}

const OrganizationDetails = ({ 
  organizationName, 
  setOrganizationName
}: OrganizationDetailsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
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
      </div>
    </Card>
  );
};

export default OrganizationDetails;
