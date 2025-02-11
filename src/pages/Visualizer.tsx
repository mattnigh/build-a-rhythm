
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
      return { monthly: 20, quarterly: 60, annual: 240 }; // Assuming 20 working days per month
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
      return { monthly: 1/2, quarterly: 1.5, annual: 6 }; // Assuming ad hoc meetings happen roughly 6 times a year
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

      // Initialize category if it doesn't exist
      ['monthly', 'quarterly', 'annual'].forEach(period => {
        if (!categoryTimes[period][category]) {
          categoryTimes[period][category] = 0;
        }
        categoryTimes[period][category] += duration * multipliers[period];
      });
    });
  });

  // Convert to array format for charts
  return {
    monthly: Object.entries(categoryTimes.monthly).map(([name, minutes]) => ({ 
      name, 
      minutes: Math.round(minutes as number)
    })),
    quarterly: Object.entries(categoryTimes.quarterly).map(([name, minutes]) => ({ 
      name, 
      minutes: Math.round(minutes as number)
    })),
    annual: Object.entries(categoryTimes.annual).map(([name, minutes]) => ({ 
      name, 
      minutes: Math.round(minutes as number)
    }))
  };
};

const TimeChart = ({ data, title }: { data: any[], title: string }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
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
          <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="minutes" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const Visualizer = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0].id);
  
  const selectedOrg = organizations.find(org => org.id === selectedOrgId);
  const rhythmData = selectedOrg ? getRhythmData(selectedOrg.content) : [];
  const timeMetrics = calculateTimeMetrics(rhythmData);

  const getHeaderInfo = (content: string) => {
    const lines = content.split('\n');
    const headerLine = lines.find(line => line.startsWith('# '));
    return headerLine ? headerLine.replace('# ', '') : "Rhythm Visualizer";
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

      <div className="grid grid-cols-1 gap-8">
        <TimeChart data={timeMetrics.monthly} title="Monthly Time per Category (minutes)" />
        <TimeChart data={timeMetrics.quarterly} title="Quarterly Time per Category (minutes)" />
        <TimeChart data={timeMetrics.annual} title="Annual Time per Category (minutes)" />
      </div>
    </div>
  );
};

export default Visualizer;
