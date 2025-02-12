
/**
 * Rhythm Analysis Page
 * Displays and analyzes rhythm data with charts and tables
 */

import { useMemo, useState } from "react";
import { organizations } from "@/data/organizations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RhythmDetail } from "@/types/rhythm";
import { TimeChart } from "@/components/rhythm/TimeChart";
import { RhythmTable } from "@/components/rhythm/RhythmTable";
import { calculateTimeMetrics } from "@/utils/timeCalculations";
import { getRhythmData, getHeaderInfo } from "@/utils/rhythmParser";

const Visualizer = () => {
  // State for organization selection and table sorting
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0].id);
  const [sortColumn, setSortColumn] = useState<keyof RhythmDetail>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Get selected organization and its rhythm data
  const selectedOrg = organizations.find(org => org.id === selectedOrgId);
  const rhythmData = selectedOrg ? getRhythmData(selectedOrg.content) : [];
  const timeMetrics = calculateTimeMetrics(rhythmData);

  // Flatten rhythm data for table display
  const allRhythms = useMemo(() => {
    return rhythmData.flatMap(section => section.items);
  }, [rhythmData]);

  // Sort rhythms based on selected column and direction
  const sortedRhythms = useMemo(() => {
    return [...allRhythms].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string values
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [allRhythms, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (column: keyof RhythmDetail) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header section with organization selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#9b87f5]">Data and Analysis</h1>
        <Select
          value={selectedOrgId}
          onValueChange={(value) => setSelectedOrgId(value)}
        >
          <SelectTrigger className="w-[280px] bg-card border-input">
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

      {/* Rhythm details table */}
      <div className="mb-8">
        <RhythmTable
          rhythms={sortedRhythms}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>

      {/* Time analysis charts */}
      <div className="grid grid-cols-1 gap-8">
        <TimeChart 
          data={timeMetrics.monthly.data} 
          title="Monthly Time per Category (hours)" 
          total={timeMetrics.monthly.total}
        />
        <TimeChart 
          data={timeMetrics.quarterly.data} 
          title="Quarterly Time per Category (hours)" 
          total={timeMetrics.quarterly.total}
        />
        <TimeChart 
          data={timeMetrics.annual.data} 
          title="Annual Time per Category (hours)" 
          total={timeMetrics.annual.total}
        />
      </div>
    </div>
  );
};

export default Visualizer;
