
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
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

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
      const match = line.match(/- (.*?)\[(.*?)\]\s*\[(.*?)\](.*)/);
      if (match) {
        currentSection.items.push({
          name: match[1].trim(),
          attendees: match[2].trim(),
          duration: parseInt(match[3]),
          link: match[4]?.trim()
        });
      }
    }
  }
  if (currentSection.title) {
    sections.push(currentSection);
  }
  return sections;
};

const calculateTimeMetrics = (rhythmData: any[]) => {
  const monthlyTime = {
    Daily: 0,
    Weekly: 0,
    'Bi-Weekly': 0,
    Monthly: 0,
    Quarterly: 0,
    Annual: 0
  };

  const quarterlyTime = { ...monthlyTime };
  const annualTime = { ...monthlyTime };

  rhythmData.forEach(section => {
    const rhythmType = section.title.split(' ')[0];
    const totalMinutes = section.items.reduce((acc: number, item: any) => acc + item.duration, 0);

    // Calculate time based on rhythm frequency
    switch (rhythmType.toLowerCase()) {
      case 'daily':
        monthlyTime.Daily += totalMinutes * 20; // Assuming 20 working days
        quarterlyTime.Daily += totalMinutes * 60;
        annualTime.Daily += totalMinutes * 240;
        break;
      case 'weekly':
        monthlyTime.Weekly += totalMinutes * 4;
        quarterlyTime.Weekly += totalMinutes * 12;
        annualTime.Weekly += totalMinutes * 48;
        break;
      case 'bi-weekly':
        monthlyTime['Bi-Weekly'] += totalMinutes * 2;
        quarterlyTime['Bi-Weekly'] += totalMinutes * 6;
        annualTime['Bi-Weekly'] += totalMinutes * 24;
        break;
      case 'monthly':
        monthlyTime.Monthly += totalMinutes;
        quarterlyTime.Monthly += totalMinutes * 3;
        annualTime.Monthly += totalMinutes * 12;
        break;
      case 'quarterly':
        monthlyTime.Quarterly += totalMinutes / 3;
        quarterlyTime.Quarterly += totalMinutes;
        annualTime.Quarterly += totalMinutes * 4;
        break;
      case 'annual':
        monthlyTime.Annual += totalMinutes / 12;
        quarterlyTime.Annual += totalMinutes / 4;
        annualTime.Annual += totalMinutes;
        break;
    }
  });

  return {
    monthly: Object.entries(monthlyTime).map(([name, value]) => ({ name, minutes: Math.round(value) })),
    quarterly: Object.entries(quarterlyTime).map(([name, value]) => ({ name, minutes: Math.round(value) })),
    annual: Object.entries(annualTime).map(([name, value]) => ({ name, minutes: Math.round(value) }))
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
          <XAxis dataKey="name" />
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
        <h1 className="text-2xl font-semibold text-gray-900">Time Analysis</h1>
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
        <TimeChart data={timeMetrics.monthly} title="Monthly Time Distribution (minutes)" />
        <TimeChart data={timeMetrics.quarterly} title="Quarterly Time Distribution (minutes)" />
        <TimeChart data={timeMetrics.annual} title="Annual Time Distribution (minutes)" />
      </div>
    </div>
  );
};

export default Visualizer;
