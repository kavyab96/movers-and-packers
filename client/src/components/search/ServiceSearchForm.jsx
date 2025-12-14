import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import LocationCombobox from "@/components/search/LocationCombobox";

export default function ServiceSearchForm({ areas, onSubmit }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState(null);

  const handleSearch = () => {
    if (!pickup || !dropoff || !date) {
      toast.warning("Please select all fields");
      return;
    }

    onSubmit({
      pickup,
      dropoff,
      date: date.toISOString(),
    });
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-5xl bg-white dark:bg-neutral-900 shadow-md rounded-2xl border flex flex-col md:flex-row overflow-hidden">

        {/* PICKUP */}
        <div className="flex-1 p-2 md:border-r hover:bg-gray-200">
          <label className="text-[1rem] uppercase font-semibold ms-2">From</label>
          <LocationCombobox
            value={pickup}
            onChange={setPickup}
            areas={areas}
            placeholder="Select pickup area"
          />
        </div>

        {/* DROPOFF */}
        <div className="flex-1 p-2 md:border-r hover:bg-gray-200">
          <label className="text-[1rem] uppercase font-semibold ms-2">To</label>
          <LocationCombobox
            value={dropoff}
            onChange={setDropoff}
            areas={areas}
            placeholder="Select drop-off area"
          />
        </div>

        {/* DATE */}
        <div className="flex-1 p-2 md:border-r hover:bg-gray-200">
          <label className="text-[1rem] uppercase font-semibold ms-2">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="none"
                className="w-full p-9 pl-0 justify-start text-left border-none shadow-none focus:ring-0"
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                {date ? format(date, "PPP") : <span className="text-gray-400">Select date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Calendar mode="single" selected={date} onSelect={setDate}  disabled={(date) => date < new Date()}/>
            </PopoverContent>
          </Popover>
        </div>

        {/* SEARCH */}
        <div className="p-2 bg-amber-500/90 active:bg-amber-400">
          <Button
            variant="none"
            className="w-full h-full p-9 rounded-xl text-white shadow-none
            transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

      </div>
    </div>
  );
}
