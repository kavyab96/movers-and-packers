import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

const EarningsFilter = ({ filters, onChange, onClear }) => {
  return (
    <div className="flex items-center gap-4 p-4">

      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.date
              ? format(filters.date, "PPP")
              : "Filter by date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={filters.date}
            onSelect={(date) =>
              onChange({ ...filters, date })
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Clear button (only show if date exists) */}
      {filters.date && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EarningsFilter;
