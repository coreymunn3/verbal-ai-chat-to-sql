"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Config, Result } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DynamicChart } from "./DynamicChart";

interface ResultsViewerProps {
  results: Result[];
  columns: string[];
  chartConfig: Config;
}

const ResultsViewer = ({
  results,
  columns,
  chartConfig,
}: ResultsViewerProps) => {
  const formatColumnTitle = (title: string) => {
    return title
      .split("_")
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join(" ");
  };

  return (
    <div className="w-full flex flex-col">
      <Tabs defaultValue="table" className="w-full flex flex-col">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <div className="relative overflow-hidden rounded-lg border">
            <Table className="divide-y divide-border min-w-full table-auto">
              <TableHeader className="bg-secondary sticky top-0 shadow-sm">
                <TableRow>
                  {columns.map((col, index) => (
                    <TableHead
                      key={index}
                      className="p-4 text-left text-xs text-muted-foreground uppercase tracking-wide"
                    >
                      {formatColumnTitle(col)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border">
                {results.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted">
                    {columns.map((col, cellIndex) => (
                      <TableCell key={cellIndex} className="px-4 py-2">
                        {row[col]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="chart">
          <DynamicChart chartData={results} chartConfig={chartConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ResultsViewer;
