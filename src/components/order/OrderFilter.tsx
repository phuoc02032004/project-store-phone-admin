import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OrderFilterProps {
  onFilter: (filters: {
    search?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleApplyFilter = () => {
    onFilter({ search, status, startDate, endDate });
  };

  const handleClearFilter = () => {
    setSearch("");
    setStatus("");
    setStartDate(undefined);
    setEndDate(undefined);
    onFilter({}); // Clear all filters
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white/20 rounded-lg shadow-2xl mb-4">
      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="search" className="text-white">Search</Label>
        <Input
          id="search"
          placeholder="Search by Order ID or User Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10 text-white border-white/30"
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="status" className="text-white">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-white/10 text-white border-white/30">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="startDate" className="text-white">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-gray-900 text-white border-gray-600 shadow-sm",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 text-white border border-gray-700 shadow-lg">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="rounded-md shadow-sm"
              captionLayout="dropdown"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="endDate" className="text-white">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-gray-900 text-white border-gray-600 shadow-sm",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 text-white border border-gray-700 shadow-lg">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleApplyFilter} className="bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0 text-white">
        <FilterIcon className="mr-2 h-4 w-4" /> Apply Filter
      </Button>
      <Button onClick={handleClearFilter} variant="outline" className="bg-white/10 text-white border-white/30">
        Clear Filter
      </Button>
    </div>
  );
};

export default OrderFilter;