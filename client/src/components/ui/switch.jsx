import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      color: {
        default:
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        theme:
          "data-[state=checked]:bg-(--switch-track-dark) data-[state=unchecked]:bg-(--switch-track-light)",
        header:
          "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-yellow-300",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

function Switch({ className, color, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        switchVariants({ color }),
        "border border-transparent focus-visible:border-ring focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
