import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command";

export default function LocationCombobox({ value, onChange, areas, placeholder }) {
  return (
    <Popover >
      <PopoverTrigger asChild >
        <Button variant="none" className="w-full justify-between p-9">
          {value
            ? areas.find((a) => a._id === value)?.name
            :  <span className="text-gray-400">{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-56 bg-white dark:bg-neutral-900">
        <Command>
          <CommandInput placeholder="Search area..."   />
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            {areas.map((area) => (
              <CommandItem
                key={area._id}
                onSelect={() => onChange(area._id)}
              >
                {area.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
