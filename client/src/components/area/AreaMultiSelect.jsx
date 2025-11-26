import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Check } from "lucide-react";


export default function AreaMultiSelect({ areas, value, onChange }) {
  const [open, setOpen] = useState(false);

  const toggleValue = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));   // remove
    } else {
      onChange([...value, id]);                  // add
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto min-h-10 py-2 px-3 flex flex-wrap gap-2 items-center"
          >
            {/* Show badges inside the button */}
            <div className="flex flex-wrap gap-2">
              {value.length === 0 && (
                <span className="text-muted-foreground">Select service areas</span>
              )}

              {value.map((id) => {
                const area = areas.find((a) => a._id === id);
                return (
                  <Badge key={id} variant="secondary" className="bg-amber-300">
                    {area?.name}
                  </Badge>
                );
              })}
            </div>

            <ChevronsUpDown className="h-4 w-4 opacity-50 ml-auto" />
          </Button>
        </PopoverTrigger>

        {/* Dropdown */}
        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder="Search area..." />
            <CommandEmpty>No area found.</CommandEmpty>
            <CommandGroup className="max-h-56 overflow-y-auto">
              {areas.map((area) => (
                <CommandItem
                  key={area._id}
                  onSelect={() => toggleValue(area._id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value.includes(area._id) ? "opacity-100" : "opacity-0"
                      }`}
                  />
                  {area.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
