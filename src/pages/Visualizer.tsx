
import { useMemo, useState } from "react";
import { organizations } from "@/data/organizations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface RhythmDetail {
  name: string;
  category: string;
  attendees: string;
  duration: number;
  frequency: string;
}

const getRhythmData = (content: string) => {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { title: '', items: [] as any[] };
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { 
        title: line.replace('## ', ''), 
        items: []
      };
    } else if (line.startsWith('- ')) {
      const match = line.match(/- (.*?)\[(.*?)\]\s*\[(.*?)\]\s*\[(.*?)\](.*)/);
      if (match) {
        currentSection.items.push({
          name: match[1].trim(),
          category: currentSection.title,
          attendees: match[2].trim(),
          duration: parseInt(match[3]),
          frequency: match[4].trim(),
          link: match[5]?.trim()
        });
      }
    }
  }
  if (currentSection.title) {
    sections.push(currentSection);
  }
  return sections;
};

const getFrequencyMultiplier = (frequency: string) => {
  switch (frequency.toLowerCase()) {
    case 'daily':
      return { monthly: 20, quarterly: 60, annual: 240 };
    case 'weekly':
      return { monthly: 4, quarterly: 12, annual: 48 };
    case 'bi-weekly':
      return { monthly: 2, quarterly: 6, annual: 24 };
    case 'monthly':
      return { monthly: 1, quarterly: 3, annual: 12 };
    case 'quarterly':
      return { monthly: 1/3, quarterly: 1, annual: 4 };
    case 'annual':
      return { monthly: 1/12, quarterly: 1/4, annual: 1 };
    case 'ad hoc':
      return { monthly: 1/2, quarterly: 1.5, annual: 6 };
    default:
      return { monthly: 0, quarterly: 0, annual: 0 };
  }
};

const calculateTimeMetrics = (rhythmData: any[]) => {
  const categoryTimes = {
    monthly: {},
    quarterly: {},
    annual: {}
  };

  rhythmData.forEach(section => {
    const category = section.title;
    
    section.items.forEach(item => {
      const multipliers = getFrequencyMultiplier(item.frequency);
      const duration = item.duration;

      ['monthly', 'quarterly', 'annual'].forEach(period => {
        if (!categoryTimes[period][category]) {
          categoryTimes[period][category] = 0;
        }
        categoryTimes[period][category] += duration * multipliers[period];
      });
    });
  });

  const calculatePeriodData = (periodTimes: Record<string, number>) => {
    const data = Object.entries(periodTimes).map(([name, minutes]) => ({ 
      name, 
      hours: Number((minutes / 60).toFixed(1))
    }));
    const total = Number((Object.values(periodTimes).reduce((a, b) => a + b, 0) / 60).toFixed(1));
    return { data, total };
  };

  return {
    monthly: calculatePeriodData(categoryTimes.monthly),
    quarterly: calculatePeriodData(categoryTimes.quarterly),
    annual: calculatePeriodData(categoryTimes.annual)
  };
};

const TimeChart = ({ data, title, total }: { data: any[], title: string, total: number }) => (
  <Card className="w-full">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <div className="text-sm font-medium text-muted-foreground">
          Total: {total} hours
        </div>
      </div>
    </CardHeader>
    <CardContent className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
          />
          <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const Visualizer = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0].id);
  const [filterValue, setFilterValue] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof RhythmDetail>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const selectedOrg = organizations.find(org => org.id === selectedOrgId);
  const rhythmData = selectedOrg ? getRhythmData(selectedOrg.content) : [];
  const timeMetrics = calculateTimeMetrics(rhythmData);

  const getHeaderInfo = (content: string) => {
    const lines = content.split('\n');
    const headerLine = lines.find(line => line.startsWith('# '));
    return headerLine ? headerLine.replace('# ', '') : "Rhythm Visualizer";
  };

  const allRhythms = useMemo(() => {
    return rhythmData.flatMap(section => section.items);
  }, [rhythmData]);

  const filteredAndSortedRhythms = useMemo(() => {
    let filtered = allRhythms;
    
    if (filterValue) {
      const lowerFilter = filterValue.toLowerCase();
      filtered = filtered.filter(rhythm => 
        rhythm.name.toLowerCase().includes(lowerFilter) ||
        rhythm.category.toLowerCase().includes(lowerFilter) ||
        rhythm.attendees.toLowerCase().includes(lowerFilter) ||
        rhythm.frequency.toLowerCase().includes(lowerFilter) ||
        rhythm.duration.toString().includes(lowerFilter)
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [allRhythms, filterValue, sortColumn, sortDirection]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Category Time Analysis</h1>
        <Select
          value={selectedOrgId}
          onValueChange={(value) => setSelectedOrgId(value)}
        >
          <SelectTrigger className="w-[280px] bg-white">
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

      <div className="mb-8">
        <div className="mb-4">
          <Input
            placeholder="Filter rhythms..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="h-8 flex items-center gap-1"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('category')}
                    className="h-8 flex items-center gap-1"
                  >
                    Category
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('attendees')}
                    className="h-8 flex items-center gap-1"
                  >
                    Attendees
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('duration')}
                    className="h-8 flex items-center gap-1"
                  >
                    Duration (min)
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('frequency')}
                    className="h-8 flex items-center gap-1"
                  >
                    Frequency
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRhythms.map((rhythm, index) => (
                <TableRow key={index}>
                  <TableCell>{rhythm.name}</TableCell>
                  <TableCell>{rhythm.category}</TableCell>
                  <TableCell>{rhythm.attendees}</TableCell>
                  <TableCell>{rhythm.duration}</TableCell>
                  <TableCell>{rhythm.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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

