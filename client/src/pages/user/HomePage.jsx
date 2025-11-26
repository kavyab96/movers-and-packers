import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from 'sonner';


import { Card } from "@/components/ui/card";
import { useAreas } from "../../context/AreaContext";
import LocationCombobox from "@/components/search/LocationCombobox";
import { useNavigate } from "react-router-dom";
// import { searchProviders } from "../../services/userServices"





const HomePage = () => {
  const navigate = useNavigate();

  const { areas } = useAreas();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState(null);

  const findProviders = () => {
    if (!pickup || !dropoff || !date) {
      toast.warning("Please select all fields");
      return;
    }
    navigate(`/providers?pickup=${pickup}&dropoff=${dropoff}&date=${date.toISOString()}`);
    // const query = {pickup,dropoff,date: date.toISOString()}
    // searchProviders(query)
  }

  return (
    <>





      <div className="w-full flex justify-center mt-10">
        <div className="w-full max-w-5xl bg-white dark:bg-neutral-900 shadow-md rounded-2xl border flex overflow-hidden">

          {/* PICKUP */}
          <div className="flex-1 p-2  border-r hover:bg-gray-200">
            <label className="text-[1rem] uppercase font-semibold ms-2">From</label>
            <LocationCombobox
              value={pickup}
              onChange={setPickup}
              areas={areas}
              placeholder="Select pickup area"
              className="border-none shadow-none focus:ring-0
               placeholder:text-red-500
               "
            />
          </div>

          {/* DROPOFF */}
          <div className="flex-1 p-2 border-r hover:bg-gray-200">
            <label className="text-[1rem] uppercase font-semibold ms-2">To</label>
            <LocationCombobox
              value={dropoff}
              onChange={setDropoff}
              areas={areas}
              variant
              placeholder="Select drop-off area"
              className="border-none shadow-none focus:ring-0 "
            />
          </div>

          {/* DATE */}
          <div className="flex-1 p-2 border-r hover:bg-gray-200">
            <label className="text-[1rem] uppercase font-semibold ms-2 ">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="none"
                  className="w-full p-9 pl-0 justify-start text-left border-none shadow-none focus:ring-0"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                  {date ? format(date, "PPP") : <span className="text-gray-400">Select date</span> }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          {/* SEARCH BUTTON */}
          <div className="p-1 bg-amber-600/90 hover:bg-amber-500">
            <Button
             variant="none"
              className="h-full p-9 rounded-xl  text-white  shadow-none"
              onClick={findProviders}
            >
              Search
            </Button>
          </div>

        </div>
      </div>








    </>




  )
}

export default HomePage