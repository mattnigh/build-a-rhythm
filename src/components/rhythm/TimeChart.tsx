
/**
 * A component that displays time-related data in a bar chart format
 * using the Recharts library
 */

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
  TooltipProps,
} from 'recharts';

interface TimeChartProps {
  data: any[];       // Array of data points to display
  title: string;     // Chart title
  total: number;     // Total hours for display
}

// Custom tooltip component for dark mode support
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-md">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-sm text-primary">
          hours : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * TimeChart Component
 * Displays a bar chart showing time distribution across categories
 * 
 * @param data - Array of data points with 'name' and 'hours' properties
 * @param title - Title of the chart
 * @param total - Total hours to display in the header
 */
export const TimeChart = ({ data, title, total }: TimeChartProps) => (
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
          {/* X-axis configuration with angled labels for better readability */}
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
            stroke="currentColor"
            className="text-muted-foreground"
          />
          {/* Y-axis with hours label */}
          <YAxis 
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} 
            stroke="currentColor"
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {/* Bar configuration with custom color */}
          <Bar dataKey="hours" fill="#9b87f5" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
