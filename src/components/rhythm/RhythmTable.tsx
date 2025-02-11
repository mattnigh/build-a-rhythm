
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { RhythmDetail } from "@/types/rhythm";

interface RhythmTableProps {
  rhythms: RhythmDetail[];
  sortColumn: keyof RhythmDetail;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof RhythmDetail) => void;
}

export const RhythmTable = ({ 
  rhythms, 
  sortColumn, 
  sortDirection, 
  onSort 
}: RhythmTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('name')}
                className="h-8 flex items-center gap-1"
              >
                Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('category')}
                className="h-8 flex items-center gap-1"
              >
                Category
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('attendees')}
                className="h-8 flex items-center gap-1"
              >
                Attendees
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('duration')}
                className="h-8 flex items-center gap-1"
              >
                Duration (min)
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('frequency')}
                className="h-8 flex items-center gap-1"
              >
                Frequency
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rhythms.map((rhythm, index) => (
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
  );
};
